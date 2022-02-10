import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const PageWrapper = styled(Box)`
  width: 100%;
  height: calc(100vh - 76px);
  padding-bottom: 10px;
`

export const GridContainer = styled(Box)`
  display: grid;
  grid-template-columns: minmax(auto, 75%) minmax(auto, 25%);
  grid-gap: 12px;
  padding: 50px 0px 0px;
  height: 100%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 10px 0px 0px;
    grid-template-columns: 100%;
  `};
`

export const ExternalLink = styled.a`
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text1};
  display: flex;
  text-decoration: none;
  height: 80px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-bottom: 15px;
`
