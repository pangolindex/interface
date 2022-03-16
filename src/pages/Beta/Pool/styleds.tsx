import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const PageWrapper = styled(Box)`
  width: 100%;
  height: calc(100vh - 76px);
  padding-bottom: 10px;
`

export const GridContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 0px 0px;
  height: 100%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 10px 0px 0px;
  `};
`

export const ExternalLink = styled.a`
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text1};
  display: flex;
  text-decoration: none;
  height: 40px;
  width: 50%;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-bottom: 15px;
`
