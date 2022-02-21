import { Box, Text } from '@0xkilo/components'
import styled from 'styled-components'

export const ConfirmWrapper = styled(Box)`
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const PendingWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`

export const SubmittedWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
`

export const Link = styled(Text)`
  text-decoration: none;
  color: ${({ theme }) => theme.blue1};
`

export const ConfirmTop = styled(Box)`
  padding: 10px;
`

export const ConfirmBottom = styled(Box)`
  background-color: ${({ theme }) => theme.bg8};
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
`

export const CurrencyWithLogo = styled(Box)`
  display: flex;
  align-items: center;
`
export const CurrencyValue = styled(Text)`
  font-size: 26px;
  font-weight: 500;
  line-height: 42px;
  color: ${({ theme }) => theme.text1};
`

export const CurrencySymbol = styled(CurrencyValue)`
  margin-left: 10px;
`
