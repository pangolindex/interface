import React, { useState, useContext, useCallback } from 'react'
import {
  SwapWrapper,
  SwapAlertBox,
  CurrencyInputTextBox,
  ReTriesWrapper,
  InputText,
  GridContainer,
  ContentBox,
  DataBox,
  ArrowWrapper
} from './styled'
import { RefreshCcw, ChevronDown } from 'react-feather'
import { Text, Box, Button, ToggleButtons } from '@pangolindex/components'
import { ThemeContext } from 'styled-components'
import RetryDrawer from '../RetryDrawer'
import SelectTokenDrawer from '../SelectTokenDrawer'
import { useDerivedSwapInfo, useSwapActionHandlers } from 'src/state/swap/hooks'
import { Field } from 'src/state/swap/actions'

const Swap = () => {
  const theme = useContext(ThemeContext)
  const [swapType, setSwapType] = useState('MARKET' as string)
  const [isRetryDrawerOpen, setIsRetryDrawerOpen] = useState(false)
  const [isTokenDrawerOpen, setIsTokenDrawerOpen] = useState(false)
  const [tokenDrawerType, setTokenDrawerType] = useState(Field.INPUT)

  const { onCurrencySelection, onSwitchTokens } = useSwapActionHandlers()
  const {
    // v1Trade,
    // v2Trade,
    // currencyBalances,
    // parsedAmount,
    currencies
    // inputError: swapInputError
  } = useDerivedSwapInfo()

  const inputCurrency = currencies[Field.INPUT]
  const outputCurrency = currencies[Field.OUTPUT]

  const renderSwapInfoRow = (label: string, value: string) => {
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

  const onCurrencySelect = useCallback(
    currency => {
      onCurrencySelection(tokenDrawerType, currency)
    },
    [tokenDrawerType]
  )

  return (
    <SwapWrapper>
      <Box>
        <SwapAlertBox>This is a BETA release and should be used at your own risk!</SwapAlertBox>

        <Box p={10}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Text color="text1" fontSize={24} fontWeight={500}>
              Trade
            </Text>
            <ToggleButtons
              options={['MARKET', 'LIMIT']}
              value={swapType}
              onChange={value => {
                setSwapType(value)
              }}
            />
          </Box>

          <CurrencyInputTextBox
            value={''}
            onChange={(value: any) => {}}
            onTokenClick={() => {
              setTokenDrawerType(Field.INPUT)
              setIsTokenDrawerOpen(true)
            }}
            currency={inputCurrency}
            fontSize={24}
            isNumeric={true}
            placeholder="0.00"
            label="From"
          />

          <Box width="100%" textAlign="center" display="flex" justifyContent="center" mt={10}>
            <ArrowWrapper clickable>
              <RefreshCcw
                size="16"
                onClick={() => {
                  // setApprovalSubmitted(false) // reset 2 step UI for approvals
                  onSwitchTokens()
                }}
                color={theme.text4}
              />
            </ArrowWrapper>
          </Box>

          <CurrencyInputTextBox
            value={''}
            onChange={(value: any) => {}}
            onTokenClick={() => {
              setTokenDrawerType(Field.OUTPUT)
              setIsTokenDrawerOpen(true)
            }}
            currency={outputCurrency}
            fontSize={24}
            isNumeric={true}
            placeholder="0.00"
            label="To"
          />

          {swapType === 'LIMIT' && (
            <GridContainer>
              <Box>
                <Text color="text4">Re-tries</Text>

                <ReTriesWrapper
                  onClick={() => {
                    setIsRetryDrawerOpen(true)
                  }}
                >
                  1
                  <Box ml={10}>
                    <ChevronDown size={14} color={theme.text4} />
                  </Box>
                </ReTriesWrapper>
              </Box>
              <Box>
                <InputText
                  value={''}
                  onChange={(value: any) => {}}
                  fontSize={24}
                  isNumeric={true}
                  placeholder="0.10%"
                  label="Slippage"
                />
              </Box>
            </GridContainer>
          )}

          <Box>
            <ContentBox>
              {renderSwapInfoRow('Minimum Received:', '301.5 PNG')}
              {renderSwapInfoRow('Price Impact:', '0.10%')}
              {renderSwapInfoRow('Liquidity Provider Fee:', '0.02 AVAX')}
            </ContentBox>
          </Box>

          <Box width="100%" mt={20}>
            <Button variant="primary" onClick={() => {}} loading={false}>
              Swap
            </Button>
          </Box>
        </Box>
      </Box>
      {/* Retries Drawer */}
      <RetryDrawer isOpen={isRetryDrawerOpen} onClose={() => setIsRetryDrawerOpen(false)} />
      {/* Token Drawer */}
      <SelectTokenDrawer
        isOpen={isTokenDrawerOpen}
        onClose={() => setIsTokenDrawerOpen(false)}
        onCurrencySelect={onCurrencySelect}
        selectedCurrency={tokenDrawerType === Field.INPUT ? inputCurrency : outputCurrency}
        otherSelectedCurrency={tokenDrawerType === Field.INPUT ? outputCurrency : inputCurrency}
      />
    </SwapWrapper>
  )
}
export default Swap
