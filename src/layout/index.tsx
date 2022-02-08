import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Wrapper, MainContent, AppContent } from './styled'
import Logo from 'src/assets/images/logo.svg'

const Layout: React.FC<{}> = ({ children }) => {
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(true)

  // Change to new favicon
  const favicon: HTMLLinkElement = document.getElementById("favicon") as HTMLLinkElement
  favicon.href = Logo;
 
  return (
    <Wrapper>
      <Sidebar collapsed={isDrawerCollapsed} onCollapsed={value => setIsDrawerCollapsed(value)} />
      <MainContent collapsed={isDrawerCollapsed}>
        <Header onCollapsed={() => setIsDrawerCollapsed(!isDrawerCollapsed)} />
        <AppContent>{children}</AppContent>
      </MainContent>
    </Wrapper>
  )
}

export default Layout
