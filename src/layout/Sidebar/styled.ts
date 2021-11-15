import styled from 'styled-components'
import { darken } from 'polished'
import { Text } from '@pangolindex/components'
import { NavLink } from 'react-router-dom'
import { ExternalLink } from '../../theme'

export const Sider = styled.div<{ collapsed: boolean }>`
  overflow: hidden;
  height: 100vh;
  position: fixed;
  z-index: 2;
  left: 0;
  transition: width 350ms ease;
  background-color: ${({ theme }) => theme.bg2};
  width: ${({ collapsed }) => (collapsed ? '70px' : '220px')};
  padding: 10px;
  display: flex;
  flex-direction: column;
`

export const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

export const PngIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`

export const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
`

export const BottomBar = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 1;
`

export const CollapseBar = styled.div<{ collapsed: boolean }>`
  height: 48px;
  color: ${({ theme }) => theme.text2};
  line-height: 48px;
  text-align: center;
  cursor: pointer;
  background-color: ${({ theme }) => theme.bg6};
  width: ${({ collapsed }) => (collapsed ? '50px' : '200px')};
  transition: all 0.2s;
`

export const MenuWrapper = styled.div`
  flex: 1;
  height: 100%;
  max-height: calc(100% - 220px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`

const activeClassName = 'ACTIVE'

export const MenuLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.color2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 8px;
  align-items: center;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 12px;
    color: ${({ theme }) => theme.white};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

export const MenuExternalLink = styled(ExternalLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}

  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.color2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 8px;
  font-weight: 500;

  :hover,
  :focus {
    text-decoration: none;
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

export const MenuItem = styled.div<{ isActive?: boolean; collapsed: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme, isActive }) => (isActive ? theme.text1 : theme.text2)};
  width: fit-content;
  font-weight: 500;
  line-height: 24px;
  // border: 1px solid red;
  padding: 8px;
  height: 50px;
  width: ${({ collapsed }) => (collapsed ? '50px' : '200px')};
  background-color: ${({ theme, isActive }) => (isActive ? darken(0.2, theme.color1) : 'transparent')};};
  border-radius:${({ isActive }) => (isActive ? '9px' : '0px')};};

  :hover,
  :focus {
   
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

export const Menu = styled.div`
  position: relative;
`

export const MenuName = styled(Text)`
  margin-left: 12px;
`
