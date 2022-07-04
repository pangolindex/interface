import React from 'react'
import { IconMenu } from './styled'

interface Props {
  active: boolean
  handleMobileMenu: () => void
}

export const MenuIcon: React.FC<Props> = ({ active, handleMobileMenu }) => {
  return (
    <IconMenu className={active ? 'clicked' : undefined} onClick={handleMobileMenu}>
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
    </IconMenu>
  )
}
