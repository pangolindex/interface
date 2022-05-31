import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Wrapper, MainContent, AppContent } from './styled'
import Footer from './Footer'
import URLWarning from 'src/components/Header/URLWarning'

const Layout: React.FC<unknown> = ({ children }) => {
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(true)

  return (
    <Wrapper>
      <Sidebar collapsed={isDrawerCollapsed} onCollapsed={value => setIsDrawerCollapsed(value)} />
      <MainContent collapsed={isDrawerCollapsed}>
        <URLWarning />
        <Header />
        <AppContent>{children}</AppContent>
        <Footer />
      </MainContent>
    </Wrapper>
  )
}

export default Layout
