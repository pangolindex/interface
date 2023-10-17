import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { Text } from '@honeycomb-finance/core'
import { NavLink } from 'react-router-dom'
import { ExternalLink } from '../../theme'

export const Sider = styled.div<{ collapsed: boolean }>`
  overflow: hidden;
  height: 100vh;
  position: fixed;
  z-index: 99;
  left: 0;
  transition: width 350ms ease;
  background-color: ${({ theme }) => theme.color2};
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
  left: 10px;
  right: 10px;
  z-index: 1;
  display: flex;
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

const activeclassname = 'ACTIVE'

export const MenuLink = styled(({ isHaveChildren, ...rest }: any) =>
  isHaveChildren ? <div {...rest} /> : <NavLink {...rest} />
).attrs({
  activeclassname
})`
  ${({ theme }) => theme.flexRowNoWrap}
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.color22};
  font-size: 1rem;
  width: fit-content;
  padding: 0 16px;
  margin: 0px;
  align-items: center;
  font-weight: 500;
  width: 100%;
  &.${activeclassname} {
    color: ${({ theme }) => theme.white};
  }

  :hover,
  :focus {
    width: 100%;
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

export const MenuExternalLink = styled(ExternalLink).attrs({
  activeclassname
})`
  ${({ theme }) => theme.flexRowNoWrap}

  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.color22};
  font-size: 1rem;
  width: fit-content;
  padding: 0 16px;
  margin: 0px;
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

export const MenuItem = styled.div<{ isActive?: boolean; isChildren?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme, isActive }) => (isActive ? theme.text1 : theme.text2)};
  width: 100%;
  font-weight: 500;
  line-height: 50px;
  padding: 0px;
  height: 50px;
  padding-left: ${({ isChildren }) => (isChildren ? '10px' : '0px')};
  background-color: ${({ theme, isActive }) => (isActive ? theme.primary : 'transparent')};
  border-radius: 9px;
  margin-bottom: 5px;
  overflow-y: hidden;
  white-space: nowrap;

  :hover,
  :focus {
    width: 100%;
    color: ${({ theme }) => darken(0.1, theme.text1)};
    background-color: ${({ theme, isActive }) => (!isActive ? theme.bg7 : theme.primary)};
  }
`

export const Menu = styled.div`
  position: relative;
`

export const MenuName = styled(Text)`
  margin-left: 12px;
`
