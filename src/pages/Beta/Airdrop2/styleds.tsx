import styled from 'styled-components'
import { Box } from '@pangolindex/components'

export const PageWrapper = styled(Box)`
  width: 100%;
`

export const BoxWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  gap: 15px;
`
export const ClaimBox = styled(Box)`
  width: 27%;
  height: 250px;
  background-color: #111;
  border-radius: 7px;
  padding: 1em;
`

export const Separator = styled(Box)`
  border: 1px solid rgba(255, 255, 255, 0.22);
`

export const StyledLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`