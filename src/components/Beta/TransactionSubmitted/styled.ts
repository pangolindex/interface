import { Box, Text } from '@pangolindex/components'
import styled from 'styled-components'

export const Root = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
`
export const Link = styled(Text)`
  text-decoration: none;
  color: ${({ theme }) => theme.blue1};
`
