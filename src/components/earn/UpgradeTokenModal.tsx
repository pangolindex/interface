import React, { useState, useCallback } from 'react'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonConfirmed, ButtonError } from '../Button'
import ProgressCircles from '../ProgressSteps'
import CurrencyInputPanel from '../CurrencyInputPanel'
import { CurrencyAmount, TokenAmount } from '@pangolindex/sdk'
import { useActiveWeb3React } from '../../hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { useBridgeTokenContract } from '../../hooks/useContract'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { LoadingView, SubmittedView } from '../ModalViews'
import { useTranslation } from 'react-i18next'
import { tryParseAmount } from '../../state/swap/hooks'
import { useChainId } from 'src/hooks'
import { useLibrary } from '@pangolindex/components'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

interface UpgradeTokenModalModalProps {
  isOpen: boolean
  onDismiss: () => void
  aebTokenBalance: TokenAmount | undefined
  abTokenAddress: string
}

export default function UpgradeTokenModal({
  isOpen,
  onDismiss,
  aebTokenBalance,
  abTokenAddress
}: UpgradeTokenModalModalProps) {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()
  const { library } = useLibrary()
  // track and parse user input
  const [typedValue, setTypedValue] = useState('')
  const parsedAmount: CurrencyAmount | undefined = tryParseAmount(
    chainId,
    typedValue,
    aebTokenBalance?.token ?? undefined
  )

  // state for pending and submitted txn views
  const addTransaction = useTransactionAdder()
  const [attempting, setAttempting] = useState<boolean>(false)
  const [hash, setHash] = useState<string | undefined>()
  const wrappedOnDismiss = useCallback(() => {
    setHash(undefined)
    setAttempting(false)
    onDismiss()
  }, [onDismiss])

  const bridgeTokenContract = useBridgeTokenContract(abTokenAddress, true)

  // approval data for stake
  const { t } = useTranslation()
  const [approval, approveCallback] = useApproveCallback(chainId, parsedAmount, abTokenAddress)

  async function onUpgrade() {
    setAttempting(true)
    if (bridgeTokenContract && parsedAmount && aebTokenBalance?.token) {
      if (approval === ApprovalState.APPROVED) {
        await bridgeTokenContract
          .swap(aebTokenBalance.token.address, `0x${parsedAmount.raw.toString(16)}`)
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Upgrade token'
            })
            setHash(response.hash)
          })
          .catch((_error: any) => {
            setAttempting(false)
            console.log(_error)
          })
      } else {
        setAttempting(false)
        throw new Error('Attempting to stake without approval or a signature. Please contact support.')
      }
    }
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback((_typedValue: string) => {
    setTypedValue(_typedValue)
  }, [])

  // used for max input button
  const maxAmountInput = maxAmountSpend(chainId, aebTokenBalance)
  const atMaxAmount = Boolean(maxAmountInput && parsedAmount?.equalTo(maxAmountInput))
  const handleMax = useCallback(() => {
    maxAmountInput && onUserInput(maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])

  async function onAttemptToApprove() {
    if (!bridgeTokenContract || !library) throw new Error(t('earn.missingDependencies'))
    if (!parsedAmount) throw new Error(t('earn.missingLiquidityAmount'))
    return approveCallback()
  }

  let error: string | undefined
  if (!account) {
    error = t('earn.connectWallet')
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <TYPE.mediumHeader>Upgrade</TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOnDismiss} />
          </RowBetween>
          <CurrencyInputPanel
            value={typedValue}
            onUserInput={onUserInput}
            onMax={handleMax}
            showMaxButton={!atMaxAmount}
            currency={aebTokenBalance?.token}
            label={''}
            disableCurrencySelect={true}
            customBalanceText={'Available to upgrade: '}
            id="upgrade-token"
          />

          <RowBetween>
            <ButtonConfirmed
              mr="0.5rem"
              onClick={onAttemptToApprove}
              confirmed={approval === ApprovalState.APPROVED}
              disabled={approval !== ApprovalState.NOT_APPROVED}
            >
              {t('earn.approve')}
            </ButtonConfirmed>
            <ButtonError
              disabled={!!error || approval !== ApprovalState.APPROVED}
              error={!!error && !!parsedAmount}
              onClick={onUpgrade}
            >
              {error ?? 'Upgrade'}
            </ButtonError>
          </RowBetween>
          <ProgressCircles steps={[approval === ApprovalState.APPROVED]} disabled={true} />
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOnDismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>Upgrading token</TYPE.largeHeader>
            <TYPE.body fontSize={20}>
              {parsedAmount?.toSignificant(4)} {parsedAmount?.currency?.symbol}
            </TYPE.body>
          </AutoColumn>
        </LoadingView>
      )}
      {attempting && hash && (
        <SubmittedView onDismiss={wrappedOnDismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>{t('earn.transactionSubmitted')}</TYPE.largeHeader>
            <TYPE.body fontSize={20}>
              Upgraded {parsedAmount?.toSignificant(4)} {parsedAmount?.currency?.symbol}
            </TYPE.body>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}
