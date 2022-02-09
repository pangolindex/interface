import { MenuFlyout } from 'src/components/StyledMenu'
import styled from 'styled-components'

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.text7};
  border: 1px solid #707070;
  background: ${({ theme }) => theme.bg6};
  margin: 0;
  padding: 0;
  height: 35px;

  padding: 0.15rem 0.5rem;
  border-radius: 7px;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg7};
  }
`

export const NarrowMenuFlyout = styled(MenuFlyout)`
  min-width: 8.125rem;
  background-color: ${({ theme }) => theme.bg6};

  div {
    color: ${({ theme }) => theme.text7};
    margin-left: 12px;
  }
`
export const Link = styled.div`
  cursor: pointer;
`