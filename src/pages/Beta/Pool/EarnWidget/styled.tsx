import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const Root = styled(Box)`
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg2};
`
