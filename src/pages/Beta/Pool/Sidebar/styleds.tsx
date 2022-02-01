import { Box } from '@pangolindex/components'
import styled from 'styled-components'
import { darken } from 'polished'
import { Text } from '@pangolindex/components'

export const SidebarWrapper = styled(Box)`
  width: 100%;
  background-color: ${({ theme }) => theme.color7};
  border-radius: 0px;
  height: auto;
  /* min-height: 100vh; */
  max-width: 200px;
  overflow: hidden;
`

export const Menu = styled.div`
  position: relative;
  margin-top: 100px;
`

export const MenuName = styled(Text)`
  margin-left: 8px;
`

export const MenuLink = styled.div<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  outline: none;
  cursor: pointer;
  text-decoration: none;
  font-size: 1rem;
  width: fit-content;
  margin: 0 6px;
  align-items: center;
  font-weight: 500;
  width: 100%;
  color: ${({ theme, isActive }) => (isActive ? theme.primary : theme.color22)};

  :hover,
  :focus {
    width: 100%;
    color: ${({ theme }) => theme.primary};
  }
`
export const MenuItem = styled.div<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme, isActive }) => (isActive ? darken(0.2, theme.primary) : theme.text2)};
  width: 100%;
  font-weight: 500;
  line-height: 24px;
  padding: 8px;
  height: 30px;
  margin-bottom: 5px;
  overflow-y: hidden;
  white-space: nowrap;

  :hover,
  :focus {
    width: 100%;
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

export const Circle = styled.div`
  position: absolute;
  height: 10px;
  width: 10px;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 0px 10px 10px 0px;
  left: -5px;
  overflow: hidden;
`
