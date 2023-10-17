import { Box } from '@honeycomb-finance/core'
import styled from 'styled-components'

export const DesktopWrapper = styled(Box)`
  width: 1080px;
  overflow: auto;
  border-radius: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`

export const MobileWrapper = styled(Box)`
  width: 100%;
  height: 100%;
  display: none;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  display: block;
  overflow: scroll;
`};
`

export const LeftSection = styled(Box)`
  border-right: 2px solid ${({ theme }) => theme.text6};
  display: flex;
  flex-direction: column;
`

export const DetailsWrapper = styled(Box)`
  display: grid;
  grid-template-columns: minmax(auto, 65%) minmax(auto, 35%);
  grid-gap: 0px;
`

export const Tabs = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
`

export const Tab = styled(Box)`
  padding: 15px 50px;
  font-size: 14px;
  color: ${({ theme }) => theme.text10};
  background-color: ${({ theme }) => theme.bg2};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    border-radius: 10px 10px 0 0;
  `};
`

export const RightSection = styled(Box)`
  padding: 20px;
`
