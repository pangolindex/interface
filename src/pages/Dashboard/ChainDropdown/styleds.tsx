import styled from 'styled-components'
import { MenuFlyout } from 'src/components/StyledMenu'

export const NarrowMenuFlyout = styled(MenuFlyout)`
  min-width: 8.125rem;
  background-color: ${({ theme }) => theme.bg6};
  top: 3rem;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    top: -17.25rem;
  `};

  div {
    color: ${({ theme }) => theme.text7};
    margin-left: 12px;
  }
`
export const DropdownItem = styled.div`
  weight: 100%;
  margin-left: 0px !important;
  border-radius: 12px;

  span {
    margin-left: 10px !important;
  };

  :hover {
    cursor: pointer;
    background-color: #ff6b00
  }
`