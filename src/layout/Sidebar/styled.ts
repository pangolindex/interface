import styled from 'styled-components'
import { darken } from 'polished'
import { Text } from '@pangolindex/components'
import { NavLink } from 'react-router-dom'
import { ExternalLink } from '../../theme'

export const Sider = styled.div<{ collapsed: boolean }>`
  overflow: hidden;
  height: 100vh;
  position: fixed;
  z-index: 99;
  left: 0;
  transition: width 350ms ease;
  background-color: ${({ theme }) => theme.bg2};
  width: ${({ collapsed }) => (collapsed ? '70px' : '220px')};
  padding: 10px;
  display: flex;
  flex-direction: column;

  ${({ theme, collapsed }) => theme.mediaWidth.upToSmall`
  display: ${collapsed ? 'none' : 'flex'};
  width: 100%;
  height: 100%
  `};

  * {
    overflow-x: hidden !important;
  }
`

export const BottomBar = styled.div`
  position: absolute;
  bottom: 0;
  z-index: 1;
  display: flex;
  width: 100%;
`

export const CollapseBar = styled.div`
  height: 48px;
  color: ${({ theme }) => theme.text2};
  line-height: 48px;
  text-align: center;
  cursor: pointer;
  background-color: ${({ theme }) => theme.bg6};
  width: '100%';
  transition: all 0.2s;
  display: none;

  ${({ theme }) => theme.mediaWidth.upToMedium`
   display:block;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
   display:block;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
   display:block;
  `};
`

export const MenuWrapper = styled.div`
  flex: 1;
  height: 100%;
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
  width: 100%;
  &.${activeClassName} {
    color: ${({ theme }) => theme.white};
  }

  :hover,
  :focus {
    width: 100%;
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
  overflow-y: hidden;
  white-space: nowrap;
  width: 100%;

  :hover,
  :focus {
    width: 100%;
    text-decoration: none;
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

export const MenuItem = styled.div<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme, isActive }) => (isActive ? theme.text1 : theme.text2)};
  width: 100%;
  font-weight: 500;
  line-height: 24px;
  padding: 8px;
  height: 50px;
  background-color: ${({ theme, isActive }) => (isActive ? darken(0.2, theme.color1) : 'transparent')};
  border-radius: 9px;
  margin-bottom: 5px;
  overflow-y: hidden;
  white-space: nowrap;

  :hover,
  :focus {
    width: 100%;
    color: ${({ theme }) => darken(0.1, theme.text1)};
    background-color: ${({ theme, isActive }) => (!isActive ? theme.bg7 : darken(0.2, theme.color1))};
  }
`

export const Menu = styled.div`
  position: relative;
`

export const MenuName = styled(Text)`
  margin-left: 12px;
`
