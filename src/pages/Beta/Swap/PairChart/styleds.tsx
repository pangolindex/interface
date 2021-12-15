import styled from 'styled-components'
import { Box } from '@pangolindex/components'

export const ChartWrapper = styled(Box)`
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg2};
  height: 100%;
`
