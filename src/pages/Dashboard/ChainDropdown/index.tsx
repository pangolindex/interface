import React, { useRef } from 'react'

import { useOnClickOutside } from 'src/hooks/useOnClickOutside'
import { ApplicationModal } from 'src/state/application/actions'
import { useModalOpen, useToggleModal } from 'src/state/application/hooks'
import { CHAIN, CHAINS, ChainsId } from 'src/constants/chains'

import { StyledMenuButton } from '../DateDropdown'
import { StyledMenu } from 'src/components/StyledMenu'
import PolygonIcon from 'src/assets/svg/Polygon.svg'
import { DropdownItem, NarrowMenuFlyout } from './styleds'

interface ChainDropdownProps {
  selectChain?: CHAIN
  handleSelectChain: (chain: CHAIN) => void
}

export default function ChainDropdown({ selectChain = CHAINS[ChainsId.All], handleSelectChain }: ChainDropdownProps) {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.PORTFOLIO_TOKEN)
  const toggle = useToggleModal(ApplicationModal.PORTFOLIO_TOKEN)
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        {selectChain.symbol} <img src={PolygonIcon} alt="polygon" style={{ marginLeft: '26px' }} />
      </StyledMenuButton>

      {open && (
        <NarrowMenuFlyout>
          {
            Object.values(CHAINS).map((chain: CHAIN, index: number) => {
              return (
                <DropdownItem
                  id="link" key={index}
                  style={selectChain.symbol === chain.symbol ? { backgroundColor: "#ff6b00" } : {}}
                  onClick={() => {
                    handleSelectChain(chain)
                    toggle()
                  }}
                >
                  <span>{chain.symbol}</span>
                </DropdownItem>
              )
            })
          }
        </NarrowMenuFlyout>
      )}
    </StyledMenu>
  )
}
