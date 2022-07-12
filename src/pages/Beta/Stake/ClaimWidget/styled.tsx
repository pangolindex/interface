import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const WidgetWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  flex: 1;
  text-align: center;
  padding: 20px;
`

export const Root = styled(Box)`
  display: grid;
  grid-template-rows: auto max-content;
  height: 100%;
`
