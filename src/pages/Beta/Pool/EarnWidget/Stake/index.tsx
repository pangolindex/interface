import React, { useState, useCallback, useContext, useEffect } from 'react'
import { ThemeContext } from 'styled-components'
import { ChevronDown } from 'react-feather'
import useTransactionDeadline from 'src/hooks/useTransactionDeadline'
import {
  StakeWrapper,
  InputText,
  ContentBox,
  DataBox,
  PoolSelectWrapper,
  ExtraRewardDataBox,
  InputWrapper,
  Buttons,
  CardContentBox
} from './styleds'
import { Box, Text, Button, DoubleCurrencyLogo, NumberOptions } from '@pangolindex/components'
import { useActiveWeb3React } from 'src/hooks'
import { TokenAmount, Pair, JSBI, Token } from '@pangolindex/sdk'
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
import SelectPoolDrawer from './SelectPoolDrawer'
import { useTokenBalance } from 'src/state/wallet/hooks'
import Stat from 'src/components/Stat'
import TransactionCompleted from 'src/components/Beta/TransactionCompleted'
import Loader from 'src/components/Beta/Loader'
import { useChainId } from 'src/hooks'

interface StakeProps {
  pair: Pair | null
  version: number
  onComplete?: () => void
  type: 'card' | 'detail'
  combinedApr?: number
}

const Stake = ({ pair, version, onComplete, type, combinedApr }: StakeProps) => {
  const { account, library } = useActiveWeb3React()
  const chainId = useChainId()

  const [selectedPair, setSelectedPair] = useState<Pair | null>(pair)

  const stakingInfo = useMinichefStakingInfos(2, selectedPair)?.[0]

  const theme = useContext(ThemeContext)

  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, selectedPair?.liquidityToken)
  const { liquidityInUSD } = useGetPoolDollerWorth(selectedPair)

  const [isPoolDrawerOpen, setIsPoolDrawerOpen] = useState(false)

  // track and parse user input
  const [typedValue, setTypedValue] = useState((userLiquidityUnstaked as TokenAmount)?.toExact() || '')
  const { parsedAmount, error } = useDerivedStakeInfo(
    typedValue,
    stakingInfo?.stakedAmount?.token,
    userLiquidityUnstaked
  )
  const parsedAmountWrapped = wrappedCurrencyAmount(parsedAmount, chainId)

  let hypotheticalWeeklyRewardRate: TokenAmount = new TokenAmount(stakingInfo?.rewardRatePerWeek?.token, '0')
  if (parsedAmountWrapped?.greaterThan('0')) {
    hypotheticalWeeklyRewardRate = stakingInfo?.getHypotheticalWeeklyRewardRate(
      stakingInfo?.stakedAmount.add(parsedAmountWrapped),
      stakingInfo?.totalStakedAmount.add(parsedAmountWrapped),
      stakingInfo?.totalRewardRatePerSecond
    )
  }

  const { rewardTokensAmount } = useMinichefPendingRewards(stakingInfo)

  const isSuperFarm = (rewardTokensAmount || [])?.length > 0

  // state for pending and submitted txn views
  const addTransaction = useTransactionAdder()
  const [attempting, setAttempting] = useState<boolean>(false)
  const [hash, setHash] = useState<string | undefined>()

  // pair contract for this token to be staked
  const dummyPair = new Pair(
    new TokenAmount(stakingInfo.tokens[0], '0'),
    new TokenAmount(stakingInfo.tokens[1], '0'),
    chainId
  )
  const pairContract = usePairContract(dummyPair.liquidityToken.address)

  // approval data for stake
  const deadline = useTransactionDeadline()
  const { t } = useTranslation()

  const [stepIndex, setStepIndex] = useState(4)
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(chainId, parsedAmount, stakingInfo?.stakingRewardAddress)

  const stakingContract = useStakingContract(stakingInfo?.stakingRewardAddress)
  const currency0 = unwrappedToken(selectedPair?.token0 as Token, chainId)
  const currency1 = unwrappedToken(selectedPair?.token1 as Token, chainId)
  const poolMap = useMinichefPools()

  const onChangePercentage = (value: number) => {
    if (!userLiquidityUnstaked) {
      setTypedValue('0')
      return
    }
    if (value === 100) {
      setTypedValue((userLiquidityUnstaked as TokenAmount).toExact())
    } else {
      const newAmount = (userLiquidityUnstaked as TokenAmount)
        .multiply(JSBI.BigInt(value))
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
            // we only care if the error is something _other_ than the user rejected the tx
            if (error?.code !== 4001) {
              console.error(error)
            }
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
            // we only care if the error is something _other_ than the user rejected the tx
            if (error?.code !== 4001) {
              console.error(error)
            }
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
    // if there was a tx hash, we want to clear the input
    if (hash) {
      setTypedValue('')
    }
    setHash('')
    setSignatureData(null)
    setAttempting(false)
    onComplete && onComplete()
  }, [setTypedValue, hash, onComplete])

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
    <StakeWrapper>
      {!attempting && !hash && (
        <>
          <Box flex={1}>
            {type === 'detail' && (
              <PoolSelectWrapper onClick={() => setIsPoolDrawerOpen(true)}>
                <Box display="flex" alignItems="center">
                  <DoubleCurrencyLogo size={24} currency0={currency0} currency1={currency1} />
                  <Text color="text2" fontSize={16} fontWeight={500} lineHeight="40px" marginLeft={10}>
                    {currency0?.symbol}/{currency1?.symbol}
                  </Text>
                </Box>
                <ChevronDown size="16" color={theme.text1} />
              </PoolSelectWrapper>
            )}

            <InputWrapper type={type}>
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
                        ? t('currencyInputPanel.balance') + userLiquidityUnstaked?.toSignificant(6)
                        : ' -'}
                    </Text>
                  )
                }
              />

              <Box mt={type === 'card' ? '25px' : '0px'}>
                <NumberOptions
                  onChange={value => {
                    setStepIndex(value)
                    onChangePercentage(type === 'card' ? value : value * 25)
                  }}
                  currentValue={stepIndex}
                  variant={type === 'card' ? 'box' : 'step'}
                  isPercentage={true}
                />
              </Box>
            </InputWrapper>
            {type === 'card' && (
              <CardContentBox isSuperFarm={isSuperFarm}>
                <Stat
                  title={t('migratePage.dollarWorth')}
                  stat={`${finalUsd ? `$${Number(finalUsd).toFixed(2)}` : '-'}`}
                  titlePosition="top"
                  titleFontSize={14}
                  statFontSize={16}
                  titleColor="text4"
                />

                {!isSuperFarm && (
                  <Stat
                    title={t('dashboardPage.earned_weeklyIncome')}
                    stat={`${hypotheticalWeeklyRewardRate.toSignificant(4, { groupSeparator: ',' })} PNG`}
                    titlePosition="top"
                    titleFontSize={14}
                    statFontSize={16}
                    titleColor="text4"
                  />
                )}

                <Stat
                  title={`APR`}
                  stat={combinedApr ? `${combinedApr}%` : '-'}
                  titlePosition="top"
                  titleFontSize={14}
                  statFontSize={16}
                  titleColor="text4"
                />
              </CardContentBox>
            )}

            {type === 'detail' && (
              <Box>
                <ContentBox>
                  {renderPoolDataRow(
                    t('migratePage.dollarWorth'),
                    `${finalUsd ? `$${Number(finalUsd).toFixed(2)}` : '-'}`
                  )}
                  {renderPoolDataRow(
                    `${t('dashboardPage.earned_weeklyIncome')}`,
                    `${hypotheticalWeeklyRewardRate.toSignificant(4, { groupSeparator: ',' })} PNG`
                  )}

                  {isSuperFarm && (
                    <ExtraRewardDataBox key="extra-reward">
                      <Text color="text4" fontSize={16}>
                        {t('earn.extraReward')}
                      </Text>

                      <Box textAlign="right">
                        {rewardTokensAmount?.map((reward, index) => {
                          const tokenMultiplier = stakingInfo?.rewardTokensMultiplier?.[index]
                          const extraTokenWeeklyRewardRate = stakingInfo?.getExtraTokensWeeklyRewardRate?.(
                            hypotheticalWeeklyRewardRate,
                            reward?.token,
                            tokenMultiplier
                          )
                          if (extraTokenWeeklyRewardRate) {
                            return (
                              <Text color="text4" fontSize={16} key={index}>
                                {extraTokenWeeklyRewardRate.toSignificant(4, { groupSeparator: ',' })}{' '}
                                {reward?.token?.symbol}
                              </Text>
                            )
                          }
                          return null
                        })}
                      </Box>
                    </ExtraRewardDataBox>
                  )}
                </ContentBox>
              </Box>
            )}
          </Box>

          <Buttons>
            <Button
              variant={approval === ApprovalState.APPROVED || signatureData !== null ? 'confirm' : 'primary'}
              onClick={onAttemptToApprove}
              isDisabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
              loading={attempting && !hash}
              loadingText={t('migratePage.loading')}
            >
              {t('earn.approve')}
            </Button>

            <Button
              variant="primary"
              isDisabled={!!error || (signatureData === null && approval !== ApprovalState.APPROVED)}
              onClick={() => {
                onStake()
              }}
              loading={attempting && !hash}
              loadingText={t('migratePage.loading')}
            >
              {error ?? t('earn.deposit')}
            </Button>
          </Buttons>
        </>
      )}

      {attempting && !hash && <Loader size={100} label={`${t('earn.depositingLiquidity')}`} />}
      {attempting && hash && (
        <TransactionCompleted
          submitText={`${t('earn.deposited')}`}
          isShowButtton={type === 'card' ? false : true}
          onButtonClick={() => handleDismissConfirmation()}
          buttonText="Close"
        />
      )}

      {isPoolDrawerOpen && (
        <SelectPoolDrawer
          isOpen={isPoolDrawerOpen}
          onClose={handleSelectPoolDrawerClose}
          onPoolSelect={onPoolSelect}
          selectedPair={selectedPair}
        />
      )}
    </StakeWrapper>
  )
}
export default Stake
