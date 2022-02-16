import { Box, Text } from '@pangolindex/components'
import styled from 'styled-components'

export const Root = styled(Box)`
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const MaxButton = styled.button`
  height: 28px;
  background-color: ${({ theme }) => theme.bg2};
  border: 1px solid ${({ theme }) => theme.bg2};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  color: ${({ theme }) => theme.text2};
`

export const Balance = styled(Text)`
  font-size: 12px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text2};
`

export const Buttons = styled(Box)`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  grid-gap: 10px;
  margin-top: 20px;
`

export const PendingWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`

export const StakeWrapper = styled(Box)`
  width: 100%;
  position: relative;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg6};
  padding: 10px;
`
export const GridContainer = styled(Box)`
  display: grid;
  grid-template-columns: minmax(auto, 50%) minmax(auto, 50%);
  grid-gap: 8px;
  padding: 10px 0px;
`
