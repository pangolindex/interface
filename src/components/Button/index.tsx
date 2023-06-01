import styled from 'styled-components'
import { darken } from 'polished'

import { Button } from '@pangolindex/components'

const Base = styled(Button)<{
  padding?: string
  width?: string
  borderRadius?: string
  altDisabledStyle?: boolean
}>`
  height: auto;
  padding: ${({ padding }) => (padding ? padding : '18px')};
  width: ${({ width }) => (width ? width : '100%')};
  font-weight: 500;
  text-align: center;
  border-radius: 12px;
  border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
  outline: none;
  border: 1px solid transparent;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    cursor: auto;
  }

  > * {
    user-select: none;
  }
`

export const ButtonPrimary = styled(Base)`
  background-color: ${({ theme }) => theme.yellow3};
  border-radius: 4px;
  color: white;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.yellow3)};
    background-color: ${({ theme }) => darken(0.05, theme.yellow3)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.yellow3)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.01, theme.yellow3)};
    background-color: ${({ theme }) => darken(0.01, theme.yellow3)};
  }
  &:disabled {
    background-color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? theme.primary1 : theme.bg3)};
    color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? 'white' : theme.text3)};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.7' : '1')};
  }
`

export const ButtonSecondary = styled(Base)`
  border: 1px solid ${({ theme }) => theme.yellow3};
  color: ${({ theme }) => theme.primary1};
  background-color: transparent;
  font-size: 16px;
  border-radius: 12px;
  padding: ${({ padding }) => (padding ? padding : '10px')};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.yellow3};
    border: 1px solid ${({ theme }) => theme.yellow3};
  }
  &:hover {
    border: 1px solid ${({ theme }) => theme.yellow3};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.yellow3};
    border: 1px solid ${({ theme }) => theme.yellow3};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
  a:hover {
    text-decoration: none;
  }
`
