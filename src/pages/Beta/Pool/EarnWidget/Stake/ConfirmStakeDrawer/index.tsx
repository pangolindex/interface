import React from 'react'
import { useTranslation } from 'react-i18next'
import { CurrencyAmount } from '@pangolindex/sdk'
import Drawer from 'src/components/Drawer'
import TransactionCompleted from 'src/components/Beta/TransactionCompleted'
import Loader from 'src/components/Beta/Loader'

interface Props {
  isOpen: boolean
  attemptingTxn: boolean
  txHash: string | undefined
  onClose: () => void
  parsedAmount: CurrencyAmount | undefined
  stakeErrorMessage: string | undefined
  onComplete?: () => void
}

const ConfirmStakeDrawer: React.FC<Props> = props => {
  const { isOpen, onClose, attemptingTxn, txHash, onComplete = () => {} } = props

  const { t } = useTranslation()

  const PendingContent = <Loader size={100} label={`${t('earn.depositingLiquidity')}`} />

  const SubmittedContent = <TransactionCompleted onClose={onClose} submitText={`${t('earn.deposited')}`} />

  return (
    <Drawer
      title={t('earn.depositingLiquidity')}
      isOpen={isOpen}
      onClose={() => {
        onClose()
        if (txHash) {
         
          onComplete()
        }
      }}
    >
      {attemptingTxn && !txHash && PendingContent}
      {attemptingTxn && txHash && SubmittedContent}
    </Drawer>
  )
}
export default ConfirmStakeDrawer
