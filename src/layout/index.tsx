import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import { Wrapper, MainContent, AppContent } from './styled'
import Footer from './Footer'
import URLWarning from 'src/components/Header/URLWarning'
import MobileMenu from './Header/MobileMenu'
import HederaPoolWarning from 'src/components/Header/HederaPoolWarning'

const Layout: React.FC<unknown> = () => {
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(true)

  const [activeMobileMenu, setActiveMobileMenu] = useState(false)

  const handleMobileMenu = () => {
    if (activeMobileMenu) {
      // when desactive mobile menu then close it and scroll to top
      window.scrollTo(0, 0)
    }
    setActiveMobileMenu(!activeMobileMenu)
  }

  return (
    <Wrapper>
      <Sidebar collapsed={isDrawerCollapsed} onCollapsed={value => setIsDrawerCollapsed(value)} />
      <MainContent collapsed={isDrawerCollapsed}>
        <URLWarning />
        <HederaPoolWarning />
        <Header activeMobileMenu={activeMobileMenu} handleMobileMenu={handleMobileMenu} />
        <AppContent>
          <Outlet />
        </AppContent>
        {activeMobileMenu && <MobileMenu activeMobileMenu={activeMobileMenu} handleMobileMenu={handleMobileMenu} />}
        <Footer />
      </MainContent>
    </Wrapper>
  )
}

export default Layout
