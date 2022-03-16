import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Wrapper, MainContent, AppContent, WarningWrapper } from './styled'
import Logo from 'src/assets/images/logo.svg'
import Footer from './Footer'
import URLWarning from 'src/components/Header/URLWarning'

const Layout: React.FC<unknown> = ({ children }) => {
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(true)

  // Change to new favicon
  const favicon: HTMLLinkElement = document.getElementById('favicon') as HTMLLinkElement
  favicon.href = Logo

  return (
    <Wrapper>
      <Sidebar
        collapsed={true}
        /* collapsed={isDrawerCollapsed} */ onCollapsed={value => setIsDrawerCollapsed(value)}
      />
      <MainContent collapsed={isDrawerCollapsed}>
        <Header />
        <WarningWrapper>
          <URLWarning />
        </WarningWrapper>
        <AppContent>{children}</AppContent>
        <Footer />
      </MainContent>
    </Wrapper>
  )
}

export default Layout
