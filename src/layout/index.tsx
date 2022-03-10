import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Wrapper, MainContent, AppContent } from './styled'
import Footer from './Footer'
import Logo from 'src/assets/images/logo.svg'

const Layout: React.FC<unknown> = ({ children }) => {
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(true)

  // Change to new favicon
  const favicon: HTMLLinkElement = document.getElementById('favicon') as HTMLLinkElement
  favicon.href = Logo

  return (
    <Wrapper>
      <Sidebar collapsed={isDrawerCollapsed} onCollapsed={value => setIsDrawerCollapsed(value)} />
      <MainContent collapsed={isDrawerCollapsed}>
        <Header />
        <AppContent>{children}</AppContent>
        <Footer />
      </MainContent>
    </Wrapper>
  )
}

export default Layout
