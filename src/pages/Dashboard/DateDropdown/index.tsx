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

export default function DateDropdown() {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.PORTFOLIO_DATE)
  const toggle = useToggleModal(ApplicationModal.PORTFOLIO_DATE)

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>Daily</StyledMenuButton>

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
