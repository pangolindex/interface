import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import HederaPoolWarning from 'src/components/Header/HederaPoolWarning'
import URLWarning from 'src/components/Header/URLWarning'
import styled from 'styled-components'
import Footer from './Footer'
import Header from './Header'
import MobileMenu from './Header/MobileMenu'
import Sidebar from './Sidebar'
import { AppContent, MainContent, Wrapper } from './styled'

const APRWarning = styled.div`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.black};
  padding: 10px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
`

const APRWarningLink = styled.a`
  color: ${({ theme }) => theme.black};
  font-weight: 700;
  text-decoration: underline;
`

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
        <APRWarning>
          Please be advised that $PNG farming rewards have ceased and the APRs shown are inaccurate. Pangolin V3 will be
          launching soon.{' '}
          <APRWarningLink href="https://x.com/pangolindex/status/1788647901607985647" target="_blank" rel="noreferrer">
            See more details here
          </APRWarningLink>
          .
        </APRWarning>
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
