import { Box, Button } from '@pangolindex/components'
import styled from 'styled-components'

export const Root = styled(Box)`
  padding: 20px;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 10px;
  position: relative;
  overflow: hidden;
`

export const StakedAmount = styled(Box)`
  padding: 10px;
  margin-top: 5px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.bg1};
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.text7};
`

export const TokenSymbol = styled(Box)`
  background-color: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.text7};
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 8px;
  font-size: 14px;
`

export const Buttons = styled(Box)`
  display: grid;
  grid-auto-rows: minmax(0, 1fr);
  grid-auto-flow: row;
  grid-gap: 10px;
  margin-top: 15px;
`

export const UnstakeButton = styled(Button)`
  padding: 15px 18px !important;
  border: 1px solid ${({ theme }) => theme.bg9} !important;
  color: ${({ theme }) => theme.text1} !important; 
`
