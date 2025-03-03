import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import HederaPoolWarning from 'src/components/Header/HederaPoolWarning'
import URLWarning from 'src/components/Header/URLWarning'
// import { NewVersionModal } from 'src/components/NewVersionModal'
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
          Please be advised that $PNG has reached its final circulating supply of 230 million and standard farms are no longer in force or emitting PNG rewards.
          We invite you to visit our new app, currently in Beta, to discover any ongoing SuperFarms. These are temporary farms that issue dual rewards.{' '}
          <APRWarningLink href="https://beta.pangolin.exchange/superfarmsv2" target="_blank" rel="noreferrer">
            Explore SuperFarms
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
        {/* <NewVersionModal /> */}
      </MainContent>
    </Wrapper>
  )
}

export default Layout
