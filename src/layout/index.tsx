import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Wrapper, MainContent, AppContent } from './styled'
import { useCollapsedModeManager } from '../state/user/hooks'

const Layout: React.FC<{}> = ({ children }) => {
  const [isCollapsed, toggleCollapsedMode] = useCollapsedModeManager()

  return (
    <Wrapper>
      <Sidebar collapsed={isCollapsed} onCollapsed={() => toggleCollapsedMode()} />
      <MainContent collapsed={isCollapsed}>
        <Header />
        <AppContent>{children}</AppContent>
      </MainContent>
    </Wrapper>
  )
}

export default Layout
