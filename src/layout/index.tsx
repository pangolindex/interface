import React from 'react'
import { Outlet } from 'react-router-dom'
import { Wrapper } from './styled'

const Layout: React.FC<unknown> = () => {
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  )
}

export default Layout
