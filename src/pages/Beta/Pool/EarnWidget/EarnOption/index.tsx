import React from 'react'
import { Text, Box, ToggleButtons } from '@pangolindex/components'
import { EarnWrapper } from './styled'
import { useTranslation } from 'react-i18next'

interface Props {
  type: string
  setType: (value: string) => void
}

const TradeOption: React.FC<Props> = ({ type, setType }) => {
  const { t } = useTranslation()
  return (
    <EarnWrapper>
      <Box p={10}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Text color="text1" fontSize={24} fontWeight={500}>
            {type === 'EARN' ? t('stakePage.earn') : t('header.stake')}
          </Text>
          <ToggleButtons
            options={['EARN', 'STAKE']}
            value={type}
            onChange={value => {
              setType(value)
            }}
          />
        </Box>
      </Box>
    </EarnWrapper>
  )
}
export default TradeOption
