import { Box } from '@antiyro/components'
import styled from 'styled-components'

export const Root = styled(Box)`
  width: 100%;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 500px;
`
