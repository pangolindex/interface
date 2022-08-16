import styled from 'styled-components'
import { Box } from '@pangolindex/components'
import { Hidden, Visible } from 'src/theme'

export const Wrapper = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  gap: 40px;
  background-color: ${({ theme }) => theme.color2};
  border-radius: 10px;
  padding: 16px;
`

export const Title = styled(Box)`
  display: inline-grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: center;
  justify-items: center;
  width: max-content;
`

export const DestkopDetails = styled(Hidden)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, max-content));
  gap: 40px;
  justify-content: end;
  align-items: center;
`

export const MobileDetails = styled(Visible)`
  justify-content: end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
  display: grid;
`}
`
