import styled from 'styled-components'
import { Box } from '@pangolindex/components'

export const Wrapper = styled(Box)`
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg2};
  margin-top: 10px;
  padding: 10px;
`

export const InnerWrapper = styled(Box)`
  display: grid;
  grid-template-columns: minmax(auto, 50%) minmax(auto, 50%);
  grid-gap: 12px;
  margin-top: 10px;
`
