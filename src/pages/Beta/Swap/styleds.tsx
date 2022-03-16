import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const PageWrapper = styled(Box)`
  padding-top: 25px;
  width: 100%;
`

export const TopContainer = styled(Box)`
width: 100%
display: flex;
flex-wrap: wrap;
gap: 12px;
align-items: center;
justify-content: center;
  padding-bottom: .5rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    
  `};
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

export const PairInfoWrapper = styled(Box)`
width: 100%;
max-width: 400px;
display: flex;
flex-direction: column
gap: 12px;
`
