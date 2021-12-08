import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const SwapRouteWrapper = styled(Box)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 85%;
  margin: 0px auto;
  background-color: ${({ theme }) => theme.bg2};
  padding: 10px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  justify-content: center;
`
