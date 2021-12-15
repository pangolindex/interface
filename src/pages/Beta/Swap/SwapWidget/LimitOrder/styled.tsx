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
export const PValue = styled(Box)<{ isActive: boolean }>`
  margin-left: 10px;
  margin-right: 10px;
  align-items: center;
  display: flex;
  width: 100%;
  font-size: 16px;
  color: ${({ theme, isActive }) => (isActive ? theme.text1 : theme.text4)};
  border-bottom: ${({ theme, isActive }) => (isActive ? `1px solid ${theme.text1}` : 0)};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.text1};
  }
`
