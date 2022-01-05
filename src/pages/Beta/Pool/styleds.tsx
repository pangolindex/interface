import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const PageWrapper = styled(Box)`
  width: 100%;
`

export const GridContainer = styled(Box)`
  display: grid;
  grid-template-columns: minmax(auto, 75%)  minmax(auto, 25%);
  grid-gap: 12px;
  padding: 10px 0px;
`
