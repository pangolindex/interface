import styled from 'styled-components'
import { Box } from '@pangolindex/components'

export const MainContent = styled.div<{ collapsed: boolean }>`
  &&& {
    min-height: 100vh;
    margin-left: ${({ collapsed }) => (collapsed ? '70px' : '220px')};
    width: ${({ collapsed }) => `calc(100% - ${collapsed ? 70 : 220}px)`};

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
  padding: 50px;
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
  &&& {
    min-height: 100vh;
  }
`
