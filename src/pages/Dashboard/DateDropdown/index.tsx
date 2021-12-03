import React, { useRef } from 'react'
import styled from 'styled-components'

import { useOnClickOutside } from '../../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../../state/application/hooks'

import { StyledMenu, MenuFlyout /*MenuItem, MenuNavItem*/ } from '../../../components/StyledMenu'
import PolygonIcon from '../../../assets/svg/Polygon.svg'

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

const NarrowMenuFlyout = styled(MenuFlyout)`
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

export default function DateDropdown() {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.PORTFOLIO_DATE)
  const toggle = useToggleModal(ApplicationModal.PORTFOLIO_DATE)

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        Daily <img src={PolygonIcon} alt="polygon" style={{ marginLeft: '26px' }} />
      </StyledMenuButton>

      {open && (
        <NarrowMenuFlyout>
          <div id="link">Daily</div>
          <div id="link">Weekly</div>
          <div id="link">Monthly</div>
          <div id="link">Yearly</div>
        </NarrowMenuFlyout>
      )}
    </StyledMenu>
  )
}
