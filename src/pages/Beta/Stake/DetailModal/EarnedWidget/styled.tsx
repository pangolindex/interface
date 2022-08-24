import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const Root = styled(Box)`
  padding: 20px;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 10px;
  margin-top: 25px;
  width: 100%;
  position: relative;
  overflow: hidden;
  height: 280px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 10px 20px;
  `};
`

export const StatWrapper = styled(Box)`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 12px;
  margin-top: 10px;
`
