import React, { useRef } from 'react'
import { useOnClickOutside } from 'src/hooks/useOnClickOutside'
import { ApplicationModal } from 'src/state/application/actions'
import { useModalOpen, useToggleModal } from 'src/state/application/hooks'
import { StyledMenu } from 'src/components/StyledMenu'
import { StyledMenuButton, NarrowMenuFlyout, Link } from './styleds'
import PolygonIcon from 'src/assets/svg/Polygon.svg'
import { TabType } from '../index'

type Props = {
  activeTab: string
  onChange: (value: string) => void
}

const OrderTypeDropdown: React.FC<Props> = ({ activeTab, onChange }) => {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.LIMIT_ORDER_TYPE)
  const toggle = useToggleModal(ApplicationModal.LIMIT_ORDER_TYPE)

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        {activeTab} <img src={PolygonIcon} alt="polygon" style={{ marginLeft: '26px' }} />
      </StyledMenuButton>

      {open && (
        <NarrowMenuFlyout>
          <Link onClick={() => onChange(TabType.open)}>{TabType.open}</Link>
          <Link onClick={() => onChange(TabType.executed)}>{TabType.executed}</Link>
          <Link onClick={() => onChange(TabType.cancelled)}>{TabType.cancelled}</Link>
        </NarrowMenuFlyout>
      )}
    </StyledMenu>
  )
}

export default OrderTypeDropdown
