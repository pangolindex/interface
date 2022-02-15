import React, { useState, useCallback, useContext, useEffect } from 'react'
import { ThemeContext } from 'styled-components'
import { ChevronDown } from 'react-feather'
import useTransactionDeadline from 'src/hooks/useTransactionDeadline'
import { PageWrapper, InputText, ContentBox, DataBox, PoolSelectWrapper } from './styleds'
import { Box, Text, Button, Steps, Step, DoubleCurrencyLogo } from '@pangolindex/components'
import { useActiveWeb3React } from 'src/hooks'
import { TokenAmount, Pair, ChainId, JSBI, Token } from '@antiyro/sdk'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import { useGetPoolDollerWorth, useMinichefStakingInfos, useMinichefPendingRewards } from 'src/state/stake/hooks'
import { usePairContract, useStakingContract } from 'src/hooks/useContract'
import { useApproveCallback, ApprovalState } from 'src/hooks/useApproveCallback'
import { splitSignature } from 'ethers/lib/utils'
import { useDerivedStakeInfo, useMinichefPools } from 'src/state/stake/hooks'
import { wrappedCurrencyAmount } from 'src/utils/wrappedCurrency'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'src/state/transactions/hooks'
import { useTranslation } from 'react-i18next'
import ConfirmStakeDrawer from './ConfirmStakeDrawer'
import SelectPoolDrawer from './SelectPoolDrawer'

interface StakeProps {
  pair: Pair | null
  version: Number
  onComplete?: () => void
}

const Stake = ({ pair, version, onComplete }: StakeProps) => {
  const { account, chainId, library } = useActiveWeb3React()

  const [selectedPair, setSelectedPair] = useState<Pair | null>(pair)

  const stakingInfo = useMinichefStakingInfos(2, selectedPair)?.[0]

  const theme = useContext(ThemeContext)

  const { liquidityInUSD, userPgl: userLiquidityUnstaked } = useGetPoolDollerWorth(selectedPair)

  const [isPoolDrawerOpen, setIsPoolDrawerOpen] = useState(false)

  // track and parse user input
  const [typedValue, setTypedValue] = useState((userLiquidityUnstaked as TokenAmount)?.toExact() || '')
  const { parsedAmount, error } = useDerivedStakeInfo(
    typedValue,
    stakingInfo?.stakedAmount?.token,
    userLiquidityUnstaked
  )
  const parsedAmountWrapped = wrappedCurrencyAmount(parsedAmount, chainId)

  let hypotheticalRewardRate: TokenAmount = new TokenAmount(stakingInfo?.rewardRate?.token, '0')
  if (parsedAmountWrapped?.greaterThan('0')) {
    hypotheticalRewardRate = stakingInfo?.getHypotheticalRewardRate(
      stakingInfo?.stakedAmount.add(parsedAmountWrapped),
      stakingInfo?.totalStakedAmount.add(parsedAmountWrapped),
      stakingInfo?.totalRewardRate
    )
  }

  const { rewardTokensAmount } = useMinichefPendingRewards(stakingInfo)

  let isSuperFarm = (rewardTokensAmount || [])?.length > 0

  // state for pending and submitted txn views
  const addTransaction = useTransactionAdder()
  const [attempting, setAttempting] = useState<boolean>(false)
  const [hash, setHash] = useState<string | undefined>()
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  // pair contract for this token to be staked
  const dummyPair = new Pair(
    new TokenAmount(stakingInfo.tokens[0], '0'),
    new TokenAmount(stakingInfo.tokens[1], '0'),
    chainId ? chainId : ChainId.AVALANCHE
  )
  const pairContract = usePairContract(dummyPair.liquidityToken.address)

  // approval data for stake
  const deadline = useTransactionDeadline()
  const { t } = useTranslation()
  const [stepIndex, setStepIndex] = useState(4)
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(chainId ? chainId : ChainId.AVALANCHE, parsedAmount, stakingInfo?.stakingRewardAddress)

  const stakingContract = useStakingContract(stakingInfo?.stakingRewardAddress)
  const currency0 = unwrappedToken(selectedPair?.token0 as Token, chainId || ChainId.AVALANCHE)
  const currency1 = unwrappedToken(selectedPair?.token1 as Token, chainId || ChainId.AVALANCHE)
  const poolMap = useMinichefPools()

  const onChangeDot = (value: number) => {
    setStepIndex(value)
    if (!userLiquidityUnstaked) {
      setTypedValue('0')
      return
    }
    if (value === 4) {
      setTypedValue((userLiquidityUnstaked as TokenAmount).toExact())
    } else {
      const newAmount = (userLiquidityUnstaked as TokenAmount)
        .multiply(JSBI.BigInt(value * 25))
        .divide(JSBI.BigInt(100)) as TokenAmount
      setTypedValue(newAmount.toSignificant(6))
    }
  }

  async function onStake() {
    if (stakingContract && poolMap && parsedAmount && deadline) {
      setAttempting(true)
      const method = version < 2 ? 'stake' : 'deposit'
      const args =
        version < 2
          ? [`0x${parsedAmount.raw.toString(16)}`]
          : [poolMap[stakingInfo?.stakedAmount.token.address], `0x${parsedAmount.raw.toString(16)}`, account]

      if (approval === ApprovalState.APPROVED) {
        stakingContract[method](...args)
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: t('earn.depositLiquidity')
            })
            setHash(response.hash)
          })
          .catch((error: any) => {
            setAttempting(false)
            console.error(error)
          })
      } else if (signatureData) {
        const permitMethod = version < 2 ? 'stakeWithPermit' : 'depositWithPermit'
        const permitArgs =
          version < 2
            ? [
                `0x${parsedAmount.raw.toString(16)}`,
                signatureData.deadline,
                signatureData.v,
                signatureData.r,
                signatureData.s
              ]
            : [
                poolMap[stakingInfo.stakedAmount.token.address],
                `0x${parsedAmount.raw.toString(16)}`,
                account,
                signatureData.deadline,
                signatureData.v,
                signatureData.r,
                signatureData.s
              ]

        stakingContract[permitMethod](...permitArgs)
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: t('earn.depositLiquidity')
            })
            setHash(response.hash)
          })
          .catch((error: any) => {
            setAttempting(false)
            console.error(error)
          })
      } else {
        setAttempting(false)
        throw new Error(t('earn.attemptingToStakeError'))
      }
    }
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback((typedValue: string) => {
    setSignatureData(null)
    setTypedValue(typedValue)
  }, [])

  // used for max input button
  // const maxAmountInput = maxAmountSpend(userLiquidityUnstaked)
  // const atMaxAmount = Boolean(maxAmountInput && parsedAmount?.equalTo(maxAmountInput))
  // const handleMax = useCallback(() => {
  //   maxAmountInput && onUserInput(maxAmountInput.toExact())
  // }, [maxAmountInput, onUserInput])

  async function onAttemptToApprove() {
    if (!pairContract || !library || !deadline) throw new Error(t('earn.missingDependencies'))

    const liquidityAmount = parsedAmount
    if (!liquidityAmount) throw new Error(t('earn.missingLiquidityAmount'))

    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account)

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ]
    const domain = {
      name: 'Pangolin Liquidity',
      version: '1',
      chainId: chainId,
      verifyingContract: pairContract.address
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ]
    const message = {
      owner: account,
      spender: stakingInfo.stakingRewardAddress,
      value: liquidityAmount.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadline.toNumber()
    }
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit
      },
      domain,
      primaryType: 'Permit',
      message
    })

    library
      .send('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then(signature => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadline.toNumber()
        })
      })
      .catch(error => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (error?.code !== 4001) {
          approveCallback()
        }
      })
  }

  const renderPoolDataRow = (label: string, value: string) => {
    return (
      <DataBox key={label}>
        <Text color="text4" fontSize={16}>
          {label}
        </Text>

        <Text color="text4" fontSize={16}>
          {value}
        </Text>
      </DataBox>
    )
  }

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (hash) {
      setTypedValue('')
    }
    setHash('')
    setSignatureData(null)
    setAttempting(false)
  }, [setTypedValue, hash])

  const handleSelectPoolDrawerClose = useCallback(() => {
    setIsPoolDrawerOpen(false)
  }, [setIsPoolDrawerOpen])

  useEffect(() => {
    if (userLiquidityUnstaked) {
      setTypedValue(userLiquidityUnstaked?.toExact())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLiquidityUnstaked?.toExact()])

  const onPoolSelect = useCallback(
    pair => {
      setSelectedPair(pair)
    },
    [setSelectedPair]
  )

  // userLiquidityUnstaked?.toExact() -> liquidityInUSD
  // typedValue -> ?
  const finalUsd = userLiquidityUnstaked?.greaterThan('0')
    ? (Number(typedValue) * liquidityInUSD) / Number(userLiquidityUnstaked?.toExact())
    : undefined

  return (
    <PageWrapper>
      <PoolSelectWrapper onClick={() => setIsPoolDrawerOpen(true)}>
        <Box display="flex" alignItems="center">
          <DoubleCurrencyLogo size={24} currency0={currency0} currency1={currency1} />
          <Text color="text2" fontSize={16} fontWeight={500} lineHeight="40px" marginLeft={10}>
            {currency0?.symbol}/{currency1?.symbol}
          </Text>
        </Box>
        <ChevronDown size="16" color={theme.text1} />
      </PoolSelectWrapper>
      <Box mt={10}>
        <InputText
          value={typedValue}
          addonAfter={
            <Box display="flex" alignItems="center">
              <Text color="text4" fontSize={24}>
                PGL
              </Text>
            </Box>
          }
          onChange={(value: any) => {
            onUserInput(value as any)
          }}
          fontSize={24}
          isNumeric={true}
          placeholder="0.00"
          addonLabel={
            account && (
              <Text color="text2" fontWeight={500} fontSize={14}>
                {!!stakingInfo?.stakedAmount?.token && userLiquidityUnstaked
                  ? t('earn.availableToDeposit') + userLiquidityUnstaked?.toSignificant(6)
                  : ' -'}
              </Text>
            )
          }
        />
      </Box>

      <Box>
        <Steps
          onChange={value => {
            onChangeDot && onChangeDot(value)
          }}
          current={stepIndex}
          progressDot={true}
        >
          <Step />
          <Step />
          <Step />
          <Step />
          <Step />
        </Steps>
      </Box>

      <Box>
        <ContentBox>
          {renderPoolDataRow(t('migratePage.dollarWorth'), `${finalUsd ? `$${Number(finalUsd).toFixed(2)}` : '-'}`)}
          {renderPoolDataRow(
            `${t('dashboardPage.earned_dailyIncome')}`,
            `${hypotheticalRewardRate
              .multiply((60 * 60 * 24).toString())
              .toSignificant(4, { groupSeparator: ',' })} PNG`
          )}

          {isSuperFarm && (
            <DataBox key="extra-reward">
              <Text color="text4" fontSize={16}>
                {t('earn.extraReward')}
              </Text>

              {rewardTokensAmount?.map((reward, index) => {
                const tokenMultiplier = stakingInfo?.rewardTokensMultiplier?.[index]
                const extraRewardRate = stakingInfo?.getExtraTokensRewardRate?.(
                  hypotheticalRewardRate,
                  reward?.token,
                  tokenMultiplier
                )
                if (extraRewardRate) {
                  return (
                    <Text color="text4" fontSize={16} key={index}>
                      {extraRewardRate.multiply((60 * 60 * 24).toString()).toSignificant(4, { groupSeparator: ',' })}{' '}
                      {reward?.token?.symbol}
                    </Text>
                  )
                }
                return null
              })}
            </DataBox>
          )}
        </ContentBox>
      </Box>

      <Box width="100%" mt={10}>
        <Button
          variant={approval === ApprovalState.APPROVED || signatureData !== null ? 'confirm' : 'primary'}
          onClick={onAttemptToApprove}
          isDisabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
          loading={attempting && !hash}
          loadingText={t('migratePage.loading')}
        >
          {t('earn.approve')}
        </Button>
      </Box>

      <Box width="100%" mt={10}>
        <Button
          variant="primary"
          isDisabled={!!error || (signatureData === null && approval !== ApprovalState.APPROVED)}
          onClick={() => {
            setShowConfirm(true)
            onStake()
          }}
          loading={attempting && !hash}
          loadingText={t('migratePage.loading')}
        >
          {error ?? t('earn.deposit')}
        </Button>
      </Box>

      {showConfirm && (
        <ConfirmStakeDrawer
          isOpen={showConfirm}
          stakeErrorMessage={error}
          parsedAmount={parsedAmount}
          attemptingTxn={attempting}
          txHash={hash}
          onClose={handleDismissConfirmation}
          onComplete={onComplete}
        />
      )}

      <SelectPoolDrawer
        isOpen={isPoolDrawerOpen}
        onClose={handleSelectPoolDrawerClose}
        onPoolSelect={onPoolSelect}
        selectedPair={selectedPair}
      />
    </PageWrapper>
  )
}
export default Stake
