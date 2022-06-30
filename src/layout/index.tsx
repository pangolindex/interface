import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Wrapper, MainContent, AppContent } from './styled'
import Footer from './Footer'
import URLWarning from 'src/components/Header/URLWarning'
import MobileMenu from './Header/MobileMenu'

const Layout: React.FC<unknown> = ({ children }) => {
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(true)

  const [activedMobileMenu, setActivedMobileMenu] = useState(false)

  const handleMobileMenu = () => {
    if (activedMobileMenu) {
      // when desactive mobile menu then close it and scroll to top
      window.scrollTo(0, 0)
    }
    setActivedMobileMenu(!activedMobileMenu)
  }

  return (
    <Wrapper>
      <Sidebar collapsed={isDrawerCollapsed} onCollapsed={value => setIsDrawerCollapsed(value)} />
      <MainContent collapsed={isDrawerCollapsed}>
        <URLWarning />
        <Header activedMobileMenu={activedMobileMenu} handleMobileMenu={handleMobileMenu} />
        <AppContent>{children}</AppContent>
        {activedMobileMenu && <MobileMenu activedMobileMenu={activedMobileMenu} handleMobileMenu={handleMobileMenu} />}
        <Footer />
      </MainContent>
    </Wrapper>
  )
}

export default Layout
