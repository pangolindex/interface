import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const PageWrapper = styled(Box)`
  width: 100%;
`

export const TopContainer = styled(Box)`
  display: grid;
  grid-template-columns: auto minmax(auto, 400px);
  grid-gap: 12px;
`

export const StatsWrapper = styled(Box)`
  display: grid;
  grid-template-rows: max-content auto;
  grid-gap: 12px;
`

export const GridContainer = styled(Box)`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 12px;
  padding: 10px;
`

export const ChartWrapper = styled(Box)`
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg2};
`
