import React, { useState } from 'react'
import styled from 'styled-components'
import Header from './Header'
import Sidebar from './Sidebar'
import { Box } from '@pangolindex/components'

const MainContent = styled.div<{ collapsed: boolean }>`
  &&& {
    min-height: 100vh;
    margin-left: ${({ collapsed }) => (collapsed ? '70px' : '220px')};
    width: ${({ collapsed }) => `calc(100% - ${collapsed ? 70 : 220}px)`};
  }
`

const AppContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 100px; 
  padding: 50px
  height: 100%;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding:16px;
    padding-top: 2rem; 
  `};

  z-index: 1;
`

const Wrapper = styled(Box)`
  &&& {
    min-height: 100vh;
  }
`

const Layout: React.FC<{}> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <Wrapper>
      <Sidebar collapsed={collapsed} onCollapsed={value => setCollapsed(value)} />
      <MainContent collapsed={collapsed}>
        <Header />
        <AppContent>{children}</AppContent>
      </MainContent>
    </Wrapper>
  )
}

export default Layout
