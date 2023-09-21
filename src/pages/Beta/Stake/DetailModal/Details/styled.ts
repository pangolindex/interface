import { Box } from '@honeycomb-finance/core'
import styled from 'styled-components'

export const DetailsContainer = styled(Box)`
  overflow: hidden;
  width: 100%;
  background-color: ${({ theme }) => theme.bg2};
  padding: 40px;
  flex: 1;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    border-radius: 0 10px 10px 10px;
`};
`
