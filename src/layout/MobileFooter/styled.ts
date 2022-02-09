import styled from 'styled-components'
import { darken } from 'polished'
import { NavLink } from 'react-router-dom'

export const MenuWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const activeClassName = 'ACTIVE'

export const MenuLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.color22};
  font-size: 12px;
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  &.${activeClassName} {
    color: ${({ theme }) => theme.white};
  }

  :hover,
  :focus {
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
  font-weight: 500;
  line-height: 24px;
  padding: 8px;
  height: 50px;
  background-color: ${({ theme, isActive }) => (isActive ? theme.primary : 'transparent')};
  border-radius: 9px;
  margin-bottom: 5px;
  overflow-y: hidden;
  white-space: nowrap;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
    background-color: ${({ theme, isActive }) => (!isActive ? theme.bg7 : theme.primary)};
  }
`

export const Menu = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(auto, 25%) minmax(auto, 25%) minmax(auto, 25%) minmax(auto, 25%);
  grid-gap: 8px;
  width: 100%;
  padding: 10px;
`
