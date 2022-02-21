import { Box, TextInput } from '@pangolindex/components'
import styled from 'styled-components'

export const Root = styled(Box)`
  padding: 0px 20px;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 400px;
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

export const Buttons = styled(Box)<{ isStaked?: boolean }>`
  display: grid;
  grid-auto-flow: ${({ isStaked }) => (isStaked ? 'column' : 'row')};
  grid-auto-columns: minmax(0, 1fr);
  grid-gap: 10px;
  margin-top: 5px;
`

export const StakeWrapper = styled(Box)`
  width: 100%;
  position: relative;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg6};
  padding: 8px;
  margin-top: 10px;
`
export const GridContainer = styled(Box)`
  display: grid;
  grid-template-columns: minmax(auto, 50%) minmax(auto, 50%);
  grid-gap: 8px;
`
export const InputText = styled(TextInput)`
  padding: 5px;
`