import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Wrapper, MainContent, AppContent } from './styled'
import Footer from './Footer'
import URLWarning from 'src/components/Header/URLWarning'
import MobileMenu from './Header/MobileMenu'
import DesktopMenu from './Header/DesktopMenu'

const Layout: React.FC<unknown> = ({ children }) => {
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(true)
  const [activeDesktopMenu, setActiveDesktopMenu] = useState(true)
  const [activeMobileMenu, setActiveMobileMenu] = useState(false)

  const handleMobileMenu = () => {
    if (activeMobileMenu) {
      // when desactive mobile menu then close it and scroll to top
      window.scrollTo(0, 0)
    }
    setActiveMobileMenu(!activeMobileMenu)
  }

  const handleDesktopMenu = () => {
    setActiveDesktopMenu(!activeDesktopMenu)
  }

  return (
    <Wrapper>
      <Sidebar collapsed={isDrawerCollapsed} onCollapsed={value => setIsDrawerCollapsed(value)} />
      <DesktopMenu activeDesktopMenu={activeDesktopMenu} handleDesktopMenu={handleDesktopMenu} />
      <MainContent collapsed={isDrawerCollapsed}>
        <URLWarning />
        <Header
          activeMobileMenu={activeMobileMenu}
          handleMobileMenu={handleMobileMenu}
          activeDesktopMenu={activeDesktopMenu}
          handleDesktopMenu={handleDesktopMenu}
        />
        <AppContent>{children}</AppContent>
        {activeMobileMenu && <MobileMenu activeMobileMenu={activeMobileMenu} handleMobileMenu={handleMobileMenu} />}
        <Footer />
      </MainContent>
    </Wrapper>
  )
}

export default Layout
