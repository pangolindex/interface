import React, { useRef } from 'react'

import { useOnClickOutside } from 'src/hooks/useOnClickOutside'
import { ApplicationModal } from 'src/state/application/actions'
import { useModalOpen, useToggleModal } from 'src/state/application/hooks'

import { StyledMenuButton } from '../DateDropdown'
import { StyledMenu } from 'src/components/StyledMenu'
import PolygonIcon from 'src/assets/svg/Polygon.svg'
import { DropdownItem, NarrowMenuFlyout } from './styleds'
import { Chain, ALL_CHAINS } from '@pangolindex/sdk'
import { AllChain } from 'src/state/portifolio/hooks'

interface ChainDropdownProps {
  selectChain?: Chain
  handleSelectChain: (chain: Chain) => void
}

export default function ChainDropdown({ selectChain = AllChain, handleSelectChain }: ChainDropdownProps) {
  const available_chains = [AllChain, ...ALL_CHAINS]
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
          {available_chains.filter(chain => chain.tracked_by_debank).map((chain: Chain, index: number) => {
            return (
              <DropdownItem
                id="link"
                key={index}
                style={selectChain.symbol === chain.symbol ? { backgroundColor: '#FFC800' } : {}}
                onClick={() => {
                  handleSelectChain(chain)
                  toggle()
                }}
              >
                <span>{chain.symbol}</span>
              </DropdownItem>
            )
          })}
        </NarrowMenuFlyout>
      )}
    </StyledMenu>
  )
}
