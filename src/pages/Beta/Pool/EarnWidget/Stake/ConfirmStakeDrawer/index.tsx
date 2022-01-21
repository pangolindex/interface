import React, { useContext } from 'react'
import { AlertTriangle, ArrowUpCircle } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { CurrencyAmount } from '@pangolindex/sdk'
import { Text, Box, Button } from '@pangolindex/components'
import { ThemeContext } from 'styled-components'
import Drawer from '../../../../components/Drawer'
import { PendingWrapper, ErrorWrapper, ErrorBox, SubmittedWrapper } from './styled'
import { CustomLightSpinner } from 'src/theme'
import Circle from 'src/assets/images/blue-loader.svg'

interface Props {
  isOpen: boolean
  attemptingTxn: boolean
  txHash: string | undefined
  onClose: () => void
  parsedAmount: CurrencyAmount | undefined
  stakeErrorMessage: string | undefined
}

const ConfirmStakeDrawer: React.FC<Props> = props => {
  const { isOpen, onClose, attemptingTxn, txHash, parsedAmount, stakeErrorMessage } = props

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

  const ErroContent = (
    <ErrorWrapper>
      <ErrorBox>
        <AlertTriangle color={theme.red1} style={{ strokeWidth: 1.5 }} size={64} />
        <Text fontWeight={500} fontSize={16} color={'red1'} style={{ textAlign: 'center', width: '85%' }}>
          {stakeErrorMessage}
        </Text>
      </ErrorBox>
      <Button variant="primary" onClick={onClose}>
        {t('transactionConfirmation.dismiss')}
      </Button>
    </ErrorWrapper>
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
      <Button variant="primary" onClick={onClose}>
        {t('transactionConfirmation.close')}
      </Button>
    </SubmittedWrapper>
  )

  return (
    <Drawer title={t('earnPage.pngStaking')} isOpen={isOpen} onClose={onClose}>
      {attemptingTxn ? PendingContent : txHash ? SubmittedContent : ErroContent}
    </Drawer>
  )
}
export default ConfirmStakeDrawer
