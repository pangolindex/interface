import { Box } from '@0xkilo/components'
import styled from 'styled-components'

export const WidgetWrapper = styled(Box)`
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
