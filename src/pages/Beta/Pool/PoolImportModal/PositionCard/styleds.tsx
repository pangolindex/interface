import styled from 'styled-components'
import { Box } from '@antiyro/components'

export const Wrapper = styled(Box)`
  width: 100%;
  position: relative;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg6};
  margin-top: 10px;
  padding: 10px;
`

export const InnerWrapper = styled(Box)`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 12px;
  margin-top: 10px;
`
