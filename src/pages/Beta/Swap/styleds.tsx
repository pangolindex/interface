import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const PageWrapper = styled(Box)`
  width: 100%;
  padding-top: 25px;
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
