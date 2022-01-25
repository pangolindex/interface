import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const PageWrapper = styled(Box)`
  width: 100%;
  border-radius: 10px;
  padding: 20px;
  background-color: ${({ theme }) => theme.bg2};
`

export const GridContainer = styled(Box)`
  display: grid;
  grid-template-columns: minmax(auto, 60%) 40%;
  grid-gap: 12px;
  padding: 10px;
  margin-top: 20px;
`
export const Divider = styled(Box)`
  height: 1px;
  background-color: ${({ theme }) => theme.bg7};
  margin: 10px 0px 10px 0px;
  width: 100%;
`

// Portfolio Row Wrapper Styles

export const RowWrapper = styled(Box)`
  padding: 15px 10px;
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.text9};
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.bg6};
  }
`

// Portfolio Chart Styles

export const BalanceInfo = styled(Box)`
  display: grid;
  grid-template-columns: max-content auto max-content;
  grid-gap: 15px;
  align-items: center;
`

export const DurationBtns = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
