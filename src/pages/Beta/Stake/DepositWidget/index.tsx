import { Box, Button, Text, TextInput } from '@pangolindex/components'
import React, { useState, useCallback } from 'react'
import useTransactionDeadline from 'src/hooks/useTransactionDeadline'
import { TokenAmount, ChainId } from '@antiyro/sdk'
import { useActiveWeb3React } from 'src/hooks'
import { maxAmountSpend } from 'src/utils/maxAmountSpend'
import { usePngContract, useStakingContract } from 'src/hooks/useContract'
import { useApproveCallback, ApprovalState } from 'src/hooks/useApproveCallback'
import { SingleSideStakingInfo, useDerivedStakeInfo } from 'src/state/stake/hooks'
import { wrappedCurrencyAmount } from 'src/utils/wrappedCurrency'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'src/state/transactions/hooks'
import { useTranslation } from 'react-i18next'
import { splitSignature } from 'ethers/lib/utils'
import { MaxButton, Root, Balance, WeeklyRewards, Buttons, PendingWrapper } from './styled'
import TransactionSubmitted from 'src/components/Beta/TransactionSubmitted'
import { CustomLightSpinner } from 'src/theme'
import Circle from 'src/assets/images/blue-loader.svg'
import { useTokenBalance } from 'src/state/wallet/hooks'

type Props = {
  stakingInfo: SingleSideStakingInfo
  onClose: () => void
}

const DepositWidget: React.FC<Props> = ({ stakingInfo, onClose }) => {
  const { account, chainId, library } = useActiveWeb3React()
  const userPngUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token)

  // track and parse user input
  const [typedValue, setTypedValue] = useState('')
  const { parsedAmount, error } = useDerivedStakeInfo(typedValue, stakingInfo.stakedAmount.token, userPngUnstaked)
  const parsedAmountWrapped = wrappedCurrencyAmount(parsedAmount, chainId)

  let hypotheticalRewardRate: TokenAmount = new TokenAmount(stakingInfo.rewardRate.token, '0')
  if (parsedAmountWrapped?.greaterThan('0')) {
    hypotheticalRewardRate = stakingInfo.getHypotheticalRewardRate(
      stakingInfo.stakedAmount.add(parsedAmountWrapped),
      stakingInfo.totalStakedAmount.add(parsedAmountWrapped),
      stakingInfo.totalRewardRate
    )
  }

  // state for pending and submitted txn views
  const addTransaction = useTransactionAdder()
  const [attempting, setAttempting] = useState<boolean>(false)
  const [hash, setHash] = useState<string | undefined>()
  const wrappedOnDismiss = useCallback(() => {
    setHash(undefined)
    setAttempting(false)
    onClose()
  }, [onClose])

  const stakingTokenContract = usePngContract()

  // approval data for stake
  const deadline = useTransactionDeadline()
  const { t } = useTranslation()
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(chainId ? chainId : ChainId.AVALANCHE, parsedAmount, stakingInfo.stakingRewardAddress)

  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress[chainId || ChainId.AVALANCHE])

  async function onStake() {
    setAttempting(true)
    if (stakingContract && parsedAmount && deadline) {
      if (approval === ApprovalState.APPROVED) {
        stakingContract
          .stake(`0x${parsedAmount.raw.toString(16)}`)
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: t('earnPage.stakeStakingTokens', { symbol: 'PNG' })
            })
            setHash(response.hash)
          })
          .catch((error: any) => {
            setAttempting(false)
            console.error(error)
          })
      } else if (signatureData) {
        stakingContract
          .stakeWithPermit(
            `0x${parsedAmount.raw.toString(16)}`,
            signatureData.deadline,
            signatureData.v,
            signatureData.r,
            signatureData.s
          )
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: t('earnPage.stakeStakingTokens', { symbol: 'PNG' })
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
  const maxAmountInput = maxAmountSpend(chainId || ChainId.AVALANCHE, userPngUnstaked)
  const atMaxAmount = Boolean(maxAmountInput && parsedAmount?.equalTo(maxAmountInput))
  const handleMax = useCallback(() => {
    maxAmountInput && onUserInput(maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])

  async function onAttemptToApprove() {
    if (!stakingTokenContract || !library || !deadline) throw new Error(t('earn.missingDependencies'))
    const liquidityAmount = parsedAmount
    if (!liquidityAmount) throw new Error(t('earn.missingLiquidityAmount'))

    // try to gather a signature for permission
    const nonce = await stakingTokenContract.nonces(account)

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ]
    const domain = {
      name: 'Pangolin',
      chainId: chainId,
      verifyingContract: stakingTokenContract.address
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

  return (
    <Root>
      {!attempting && !hash && (
        <>
          <TextInput
            value={parsedAmount?.toExact()}
            addonAfter={
              !atMaxAmount ? (
                <Box display={'flex'} alignItems={'center'} height={'100%'} justifyContent={'center'}>
                  <MaxButton onClick={() => handleMax()}>{t('currencyInputPanel.max')}</MaxButton>
                </Box>
              ) : null
            }
            onChange={(value: any) => {
              onUserInput(value as any)
            }}
            label={`Enter PNG`}
            fontSize={24}
            isNumeric={true}
            placeholder="0.00"
            addonLabel={
              account && (
                <Balance>
                  {!!userPngUnstaked ? t('currencyInputPanel.balance') + userPngUnstaked?.toSignificant(6) : ' -'}
                </Balance>
              )
            }
          />
          <WeeklyRewards>
            <Text color="text14" fontSize={14} fontWeight={500}>
              {t('earn.weeklyRewards')}
            </Text>
            <Text color="text14" fontSize={14} fontWeight={500}>
              {hypotheticalRewardRate.multiply((60 * 60 * 24 * 7).toString()).toSignificant(4, { groupSeparator: ',' })}{' '}
              {t('earn.rewardPerWeek', { symbol: stakingInfo?.rewardToken?.symbol })}
            </Text>
          </WeeklyRewards>
          <Box flex="1" />
          <Buttons>
            <Button
              padding="15px 18px"
              variant={approval === ApprovalState.APPROVED || signatureData !== null ? 'confirm' : 'primary'}
              isDisabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
              onClick={onAttemptToApprove}
            >
              {t('earn.approve')}
            </Button>
            <Button
              padding="15px 18px"
              variant={'primary'}
              isDisabled={!!error || (signatureData === null && approval !== ApprovalState.APPROVED)}
              onClick={onStake}
            >
              {error ?? t('earn.deposit')}
            </Button>
          </Buttons>
        </>
      )}
      {attempting && !hash && (
        <PendingWrapper>
          <Box mb={'15px'}>
            <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
          </Box>
          <Text fontWeight={600} fontSize={20} color="text1">
            {t('earn.depositingToken', { symbol: 'PNG' })}
          </Text>
          <Text fontWeight={500} fontSize={14} color="text1">
            {parsedAmount?.toSignificant(4)} PNG
          </Text>
          <Box flex={1} />
          <Text color="text14" fontSize={12}>
            {t('modalView.confirmTransaction')}
          </Text>
        </PendingWrapper>
      )}
      {attempting && hash && <TransactionSubmitted onClose={wrappedOnDismiss} hash={hash} />}
    </Root>
  )
}

export default DepositWidget
