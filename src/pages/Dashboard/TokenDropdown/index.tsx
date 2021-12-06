import React, { useRef } from 'react'
import styled from 'styled-components'

import { useOnClickOutside } from '../../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../../state/application/hooks'

import { StyledMenuButton } from '../DateDropdown'
import { StyledMenu, MenuFlyout /*MenuItem, MenuNavItem*/ } from '../../../components/StyledMenu'
import PolygonIcon from '../../../assets/svg/Polygon.svg'

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

export default function TokenDropdown() {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.PORTFOLIO_TOKEN)
  const toggle = useToggleModal(ApplicationModal.PORTFOLIO_TOKEN)

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        Avax <img src={PolygonIcon} alt="polygon" style={{ marginLeft: '26px' }} />
      </StyledMenuButton>

      {open && (
        <NarrowMenuFlyout>
          <div id="link">Avax</div>
          <div id="link">Png</div>
          <div id="link">Usdt.e</div>
          <div id="link">Eth.e</div>
        </NarrowMenuFlyout>
      )}
    </StyledMenu>
  )
}
