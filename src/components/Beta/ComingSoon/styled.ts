import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const Wrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  padding: 10px;
  min-height: 350px;
  background-color: ${({ theme }) => theme.bg2};
`
