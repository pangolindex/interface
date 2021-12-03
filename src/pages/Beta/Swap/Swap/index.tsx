import React, { useState, useContext } from 'react'
import {
  SwapWrapper,
  SwapAlertBox,
  CurrencyInputTextBox,
  ReTriesWrapper,
  InputText,
  GridContainer,
  ContentBox,
  DataBox,
  ArrowWrapper,
  Divider
} from './styleds'
import { RefreshCcw, ChevronDown } from 'react-feather'
import { Text, Box, Button, ToggleButtons } from '@pangolindex/components'
import { ThemeContext } from 'styled-components'
import Drawer from './Drawer'

const Swap = () => {
  const theme = useContext(ThemeContext)
  const [swapType, setSwapType] = useState('MARKET' as string)
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false)

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
            fontSize={24}
            isNumeric={true}
            placeholder="0.00"
            label="From"
          />

          <Box width="100%" textAlign="center" display="flex" justifyContent="center">
            <ArrowWrapper clickable>
              <RefreshCcw
                size="16"
                onClick={() => {
                  // setApprovalSubmitted(false) // reset 2 step UI for approvals
                  // onSwitchTokens()
                }}
                color={theme.text4}
              />
            </ArrowWrapper>
          </Box>

          <CurrencyInputTextBox
            value={''}
            onChange={(value: any) => {}}
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
                    setIsDrawerCollapsed(true)
                  }}
                >
                  1{' '}
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
      <Drawer title="Re-tries" collapsed={isDrawerCollapsed} onCollapsed={value => setIsDrawerCollapsed(value)}>
        <Box>
          <Text color="text1" fontSize={16} fontWeight={500} marginLeft={10}>
            1
          </Text>
          <Divider />
        </Box>
      </Drawer>
    </SwapWrapper>
  )
}
export default Swap
