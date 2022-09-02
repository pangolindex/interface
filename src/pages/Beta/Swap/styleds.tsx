import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const PageWrapper = styled(Box)`
  width: 100%;
  padding-top: 25px;
  display: flex;
  flex-direction: column;
  flex: 1;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding-top: 10px;
  `};
`

export const SwapWidgetWrapper = styled(Box)`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  min-width: 320px;
  width: 400px;
  margin: auto;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: initial;
    flex:0;
  `};
`

export const TopContainer = styled(Box)`
  display: grid;
  grid-template-columns: auto minmax(auto, 400px);
  grid-gap: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: none;
    grid-template-rows: max-content auto;
  `};
`

export const StatsWrapper = styled(Box)`
  display: grid;
  grid-template-rows: max-content auto;
  grid-gap: 12px;
`

export const GridContainer = styled(Box)<{ isLimitOrders: boolean }>`
  display: grid;
  grid-template-columns: ${({ isLimitOrders }) =>
    isLimitOrders ? `minmax(auto, 50%) minmax(auto, 25%) minmax(auto, 25%)` : `minmax(auto, 50%) minmax(auto, 50%)`};
  grid-gap: 12px;
  padding: 10px 0px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: none;
    grid-template-rows: max-content;
  `};
`
