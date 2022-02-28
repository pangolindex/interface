import { Box, Text } from '@0xkilo/components'
import styled from 'styled-components'

export const Root = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
`
export const Link = styled(Text)`
  text-decoration: none;
  color: ${({ theme }) => theme.blue1};
`
