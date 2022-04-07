import { Box } from '@antiyro/components'
import styled from 'styled-components'

// portfolio section
export const HeaderDropdowns = styled(Box)`
  display: flex;
`

export const PortfolioToken = styled(Box)`
  display: flex;
  align-items: center;
  font-size: 24px;
  line-height: 97px;
  color: ${({ theme }) => theme.text7};
`

export const PortfolioTokenPercent = styled(Box)`
  font-size: 16px;
  line-height: 24px;

  color: #18c145;
  background: #063312;
  border-radius: 8px;
  margin-left: 26px;
  padding: 5px 14px;
`

export const PortfolioInfo = styled(Box)`
  display: grid;
  grid-template-columns: 5% 95%;
  grid-gap: 12px;
  font-size: 16px;
  color: ${({ theme }) => theme.text8};
  margin-top: 10px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
   font-size: 14px;
   grid-gap: 24px;
  `};
`
