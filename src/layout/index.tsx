import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Wrapper, MainContent, AppContent } from './styled'
import { useDrawerCollapsedManager } from '../state/user/hooks'

const Layout: React.FC<{}> = ({ children }) => {
  const [isDrawerCollapsed, toggleCollapsedMode] = useDrawerCollapsedManager()

  return (
    <Wrapper>
      <Sidebar collapsed={isDrawerCollapsed} onCollapsed={() => toggleCollapsedMode()} />
      <MainContent collapsed={isDrawerCollapsed}>
        <Header onCollapsed={() => toggleCollapsedMode()} />
        <AppContent>{children}</AppContent>
      </MainContent>
    </Wrapper>
  )
}

export default Layout
