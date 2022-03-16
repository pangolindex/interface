import styled from 'styled-components'
import { Box } from '@pangolindex/components'

export const MainContent = styled.div<{ collapsed: boolean }>`
  &&& {
    min-height: 100vh;
    margin-left: 140px;
    width: calc(100% - 140px);
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
  padding: 0px 10px;
  justify-content: center
  height: 100%;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding:16px;
    padding-top: 2rem; 
    margin-top: 50px;
    padding-bottom: 70px;
  `};

  z-index: 1;
`

export const WarningWrapper = styled.div`
  position: sticky;
  top: 80px;
`

export const Wrapper = styled(Box)`
  flex: 1;
`
