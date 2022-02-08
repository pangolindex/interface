import { Box, Text } from '@pangolindex/components'
import styled from 'styled-components'

export const PendingWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`

export const SubmittedWrapper = styled(Box)`
  display: grid;
  grid-template-rows: minmax(300px, auto) max-content;
  height: 100%;
  padding: 10px;
`

export const Link = styled(Text)`
  text-decoration: none;
  color: ${({ theme }) => theme.blue1};
`
