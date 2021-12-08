import { Box, CurrencyInput, Text, TextInput } from '@pangolindex/components'
import styled from 'styled-components'

export const Root = styled(Box)`
  width: 100%;
  min-width: 360px;
  position: relative;
  overflow: hidden;
`

export const SwapWrapper = styled(Box)`
  border-radius: 10px;
  width: 100%;
  min-width: 360px;
  background-color: ${({ theme }) => theme.bg2};
  position: relative;
  overflow: hidden;
`

export const SwapAlertBox = styled(Box)`
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: ${({ theme }) => theme.avaxRed};
  padding: 7px;
  font-size: 12px;
  color: ${({ theme }) => theme.white};
`

export const CurrencyInputTextBox = styled(CurrencyInput)`
  background-color: ${({ theme }) => theme.bg6};
  padding: 15px;
  align-items: center;
  border-radius: 4px;
`

export const ReTriesWrapper = styled(Box)`
  background-color: ${({ theme }) => theme.bg6};
  padding: 16px;
  align-items: center;
  border-radius: 8px;
  display: flex;
  width: 100%;
  min-width: 180px;
  justify-content: space-between;
  font-size: 18px;
  color: ${({ theme }) => theme.text4};
  cursor: pointer;
`

export const InputText = styled(TextInput)`
  background-color: ${({ theme }) => theme.bg6};
  padding: 15px;
  align-items: center;
  border-radius: 4px;
`

export const GridContainer = styled(Box)`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 12px;
`

export const ArrowWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg6};
  width: 30px;
  height: 30px;
  border-radius: 50%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`

export const AddARecipient = styled(Text)`
  cursor: pointer;
`
