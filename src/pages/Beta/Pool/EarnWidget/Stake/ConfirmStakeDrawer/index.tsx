import React, { useContext } from 'react'
import { ArrowUpCircle } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { CurrencyAmount } from '@pangolindex/sdk'
import { Text, Box, Button } from '@pangolindex/components'
import { ThemeContext } from 'styled-components'
import Drawer from '../../../../components/Drawer'
import { PendingWrapper, SubmittedWrapper } from './styled'
import { CustomLightSpinner } from 'src/theme'
import Circle from 'src/assets/images/blue-loader.svg'

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
  const { isOpen, onClose, attemptingTxn, txHash, parsedAmount, onComplete = () => {} } = props

  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  const PendingContent = (
    <PendingWrapper>
      <Box mb={'15px'}>
        <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
      </Box>
      <Text fontWeight={500} fontSize={20} color="text1" textAlign="center">
        {t('earn.depositingLiquidity')}
      </Text>
      <Text fontWeight={600} fontSize={14} color="text1" textAlign="center">
        {parsedAmount?.toSignificant(4)} PGL
      </Text>
    </PendingWrapper>
  )

  const SubmittedContent = (
    <SubmittedWrapper>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" paddingY={'20px'}>
        <Box flex="1" display="flex" alignItems="center">
          <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary1} />
        </Box>
        <Text fontWeight={500} fontSize={20} color="text1">
          {t('earn.transactionSubmitted')}
        </Text>
        <Text fontWeight={600} fontSize={14} color="text1" textAlign="center">
          {t('earn.deposited')} {parsedAmount?.toSignificant(4)} PGL
        </Text>
      </Box>
      <Button
        variant="primary"
        onClick={() => {
          onClose()
          onComplete()
        }}
      >
        {t('transactionConfirmation.close')}
      </Button>
    </SubmittedWrapper>
  )

  return (
    <Drawer title={t('earnPage.pngStaking')} isOpen={isOpen} onClose={onClose}>
      {attemptingTxn && !txHash && PendingContent}
      {attemptingTxn && txHash && SubmittedContent}
    </Drawer>
  )
}
export default ConfirmStakeDrawer
