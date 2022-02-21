import { Box } from '@0xkilo/components'
import styled from 'styled-components'

export const Wrapper = styled(Box)`
  width: 1080px;
  overflow: auto;
`

export const LeftSection = styled(Box)`
  border-right: 2px solid ${({ theme }) => theme.text9};
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
  font-size: 18px;
  color: ${({ theme }) => theme.text10};
  background-color: ${({ theme }) => theme.bg2};
`

export const RightSection = styled(Box)`
  padding: 20px;
`
