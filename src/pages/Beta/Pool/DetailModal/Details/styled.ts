import { Box } from '@0xkilo/components'
import styled from 'styled-components'

export const DetailsContainer = styled(Box)`
  overflow: hidden;
  width: 100%;
  background-color: ${({ theme }) => theme.bg2};
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`
