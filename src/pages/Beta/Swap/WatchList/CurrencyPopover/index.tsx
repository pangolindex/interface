import React, { useState } from 'react'
import { Text, Box, TextInput, Button, CurrencyLogo } from '@pangolindex/components'
import { Token } from '@pangolindex/sdk'
import { AddInputWrapper, PopoverContainer, RowWrapper } from './styled'
import Scrollbars from 'react-custom-scrollbars'
import { useTranslation } from 'react-i18next'

interface Props {
  getRef?: (ref: any) => void
  coins: Array<Token>
}

const CurrencyPopover: React.FC<Props> = ({ getRef = () => {}, coins }) => {
  const [listUrlInput, setListUrlInput] = useState<string>('')

  const { t } = useTranslation()

  return (
    <PopoverContainer ref={ref => getRef(ref)}>
      {/* Render Search Token Input */}
      <Box padding="0px 10px">
        <AddInputWrapper>
          <TextInput
            placeholder={t('searchModal.httpsPlaceholder')}
            onChange={(value: any) => {
              setListUrlInput(value as string)
            }}
            value={listUrlInput}
          />
        </AddInputWrapper>
      </Box>

      <Box position="relative" minHeight="133px">
        <Scrollbars>
          {coins.map((coin, index) => (
            <RowWrapper key={index}>
              <Box display="flex" alignItems="center">
                <CurrencyLogo size={'28px'} currency={coin} />
                <Text color="text1" fontSize={20} fontWeight={500} marginLeft={'6px'}>
                  {coin.symbol}
                </Text>
              </Box>

              <Box ml={'10px'} textAlign="right">
                <Text color="text1" fontSize={16} fontWeight={500}>
                  $120
                </Text>
              </Box>
              <Box ml={'10px'} textAlign="right">
                <Button variant="secondary" backgroundColor="bg8" color="text6" padding={'0px'}>
                  Add
                </Button>
              </Box>
            </RowWrapper>
          ))}
        </Scrollbars>
      </Box>
    </PopoverContainer>
  )
}
export default CurrencyPopover
