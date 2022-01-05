import styled from 'styled-components'
import { MenuFlyout } from 'src/components/StyledMenu'
import { Button } from '@pangolindex/components'

export const StyledMenuButton = styled(Button)`
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid #707070;
  margin: 0;
  border-radius: 8px;
  min-width: 120px;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }
`

export const NarrowMenuFlyout = styled(MenuFlyout)`
  min-width: 8.125rem;
  background-color: ${({ theme }) => theme.bg6};
  top: 3.5rem;
  padding: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  top: -17.25rem;
`};

  div {
    color: ${({ theme }) => theme.text7};
    margin-left: 12px;
  }
`
export const SortField = styled.div`
  margin: 0px 5px 0px 5px;
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  line-height: 20px;
`
