import React from 'react'
import { Text, Box, ToggleButtons } from '@pangolindex/components'
import { SwapWrapper, SwapAlertBox } from './styled'
import { useTranslation } from 'react-i18next'

interface Props {
  swapType: string
  setSwapType: (value: string) => void
}

const TradeOption: React.FC<Props> = ({ swapType, setSwapType }) => {
  const { t } = useTranslation()
  return (
    <SwapWrapper>
      <SwapAlertBox>{t('swapPage.betaRelease')}</SwapAlertBox>

      <Box p={10}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Text color="text1" fontSize={24} fontWeight={500}>
            {t('swapPage.trade')}
          </Text>
          <ToggleButtons
            options={['MARKET', 'LIMIT']}
            value={swapType}
            onChange={value => {
              setSwapType(value)
            }}
          />
        </Box>
      </Box>
    </SwapWrapper>
  )
}
export default TradeOption
