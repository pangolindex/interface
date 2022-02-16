import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  text-align: center;
  padding: 20px;
`

export const ConfirmWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  text-align: center;
`

export const PendingWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`
