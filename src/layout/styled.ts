import styled from 'styled-components'
import { Box } from '@pangolindex/components'

export const MainContent = styled.div<{ collapsed: boolean }>`
  &&& {
    min-height: 100vh;
    margin-left: 70px;
    width: calc(100% - 70px);
    display: flex;
    flex-direction: column;

    ${({ theme }) => theme.mediaWidth.upToSmall`
      margin-left: 0;
      width : 100%;
    `};
  }
`

export const AppContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 100px;
  padding: 0px 50px;
  height: 100%;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding:16px;
    padding-top: 2rem; 
    margin-top: 50px;
  `};

  z-index: 1;
`

export const Wrapper = styled(Box)`
  flex: 1;
`
