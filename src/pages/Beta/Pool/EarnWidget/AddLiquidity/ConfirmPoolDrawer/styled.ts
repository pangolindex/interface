import { Box, Text } from '@pangolindex/components'
import styled from 'styled-components'

export const Root = styled(Box)`
  display: grid;
  grid-template-rows: auto max-content;
  height: 100%;
`

export const Header = styled(Box)`
  padding: 0px 10px;
`

export const OutputText = styled(Text)`
  width: 100%;
  font-style: italic;
  font-size: 12px;
  text-align: left;
  color: ${({ theme }) => theme.text2};
`

export const Footer = styled(Box)`
  padding: 0px 10px;
`

export const PendingWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`

export const ErrorWrapper = styled(Box)`
  display: grid;
  grid-template-rows: minmax(300px, auto) max-content;
  height: 100%;
  padding: 10px;
`

export const ErrorBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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
