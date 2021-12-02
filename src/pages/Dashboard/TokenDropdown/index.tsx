import React, { useRef } from 'react'
import styled from 'styled-components'

import { useOnClickOutside } from '../../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../../state/application/hooks'

import { StyledMenu, StyledMenuButton, MenuFlyout /*MenuItem, MenuNavItem*/ } from '../../../components/StyledMenu'

const NarrowMenuFlyout = styled(MenuFlyout)`
  min-width: 8.125rem;
  background-color: ${({ theme }) => theme.bg6};
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
      <StyledMenuButton onClick={toggle}>Avax</StyledMenuButton>

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
