import { Box } from '@0xkilo/components'
import styled from 'styled-components'

export const SwapWrapper = styled(Box)`
  width: 100%;
  /* min-width: 400px; */
  background-color: ${({ theme }) => theme.color2};
  position: relative;
  overflow: hidden;
`

export const SwapAlertBox = styled(Box)`
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: ${({ theme }) => theme.venetianRed};
  padding: 7px;
  font-size: 12px;
  color: ${({ theme }) => theme.white};
`
