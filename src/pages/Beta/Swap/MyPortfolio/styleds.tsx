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
  grid-template-columns: auto auto;
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