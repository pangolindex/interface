import React, { useRef } from 'react'
import styled from 'styled-components'

import { useOnClickOutside } from 'src/hooks/useOnClickOutside'
import { ApplicationModal } from 'src/state/application/actions'
import { useModalOpen, useToggleModal } from 'src/state/application/hooks'
import { CHAIN, CHAINS } from 'src/constants/chains'
import Logo from 'src/assets/svg/icon.svg'

import { StyledMenuButton } from '../DateDropdown'
import { StyledMenu, MenuFlyout } from 'src/components/StyledMenu'
import PolygonIcon from 'src/assets/svg/Polygon.svg'

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
const DropdownItem = styled.div`
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
interface ChainDropdownProps{
  selectChain?: CHAIN
  handleSelectChain?: any
}


export default function ChainDropdown({ selectChain = {name: "All Chains", symbol: "All", logo: Logo}, handleSelectChain}: ChainDropdownProps) {
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
          <DropdownItem 
            style={selectChain.symbol === "All" ? {backgroundColor: "#ff6b00"}: {}}
            id="link" 
            onClick={() => {
              handleSelectChain({name: "All Chains", symbol: "All", logo: Logo})
              toggle()
            }}
          >
            <span>All</span>
          </DropdownItem>
          {
            Object.values(CHAINS).map((chain: CHAIN, index: number ) => {
              return (
                <DropdownItem 
                  id="link" key={index}
                  style={selectChain.symbol === chain.symbol ? {backgroundColor: "#ff6b00"}: {}}
                  onClick={() =>{
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
