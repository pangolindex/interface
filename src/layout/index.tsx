import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Wrapper, MainContent, AppContent } from './styled'

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
