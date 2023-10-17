import { Box } from '@honeycomb-finance/core'
import styled from 'styled-components'

export const CancelOrderRoot = styled(Box)`
  width: 100%;
`

export const PendingWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`

export const Root = styled(Box)`
  display: grid;
  grid-template-rows: auto max-content;
  height: 100%;
`

export const Header = styled(Box)`
  padding: 0px 10px;
`

export const Footer = styled(Box)`
  padding: 0px 10px;
`
