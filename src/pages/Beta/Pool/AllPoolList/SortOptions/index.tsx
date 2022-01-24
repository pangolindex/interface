import React, { useRef } from 'react'
import { useOnClickOutside } from 'src/hooks/useOnClickOutside'
import { ApplicationModal } from 'src/state/application/actions'
import { useModalOpen, useToggleModal } from 'src/state/application/hooks'
import { StyledMenu } from 'src/components/StyledMenu'
import { StyledMenuButton, NarrowMenuFlyout, SortField } from './styleds'
import { ChevronDown, ChevronUp } from 'react-feather'
import { SortingType } from '../PoolList'

interface SortProps {
  setSortBy: (field: string, desc: boolean) => void
  sortBy: { field: string; desc: boolean }
}

export default function DateDropdown({ setSortBy, sortBy }: SortProps) {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.POOL_SORT_OPTIONS)
  const toggle = useToggleModal(ApplicationModal.POOL_SORT_OPTIONS)

  useOnClickOutside(node, open ? toggle : undefined)

  const getSortField = (label: string, field: string, sortBy: any, setSortBy: Function) => {
    return (
      <SortField
        onClick={() => {
          const desc = sortBy?.field === field ? !sortBy?.desc : true
          setSortBy({ field, desc })
        }}
      >
        {label}
        {sortBy?.field === field && (sortBy?.desc ? <ChevronDown size="16" /> : <ChevronUp size="16" />)}
      </SortField>
    )
  }

  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton variant="plain" onClick={toggle} color="text7" backgroundColor="bg6" padding="15px">
        Sort by <ChevronDown size="16" style={{ marginLeft: '20px' }} />
      </StyledMenuButton>

      {open && (
        <NarrowMenuFlyout>
          {getSortField('Liquidity', SortingType?.totalStakedInUsd, sortBy, setSortBy)}
          {getSortField('Pool Weight', SortingType?.multiplier, sortBy, setSortBy)}
          {getSortField('APR', SortingType?.totalApr, sortBy, setSortBy)}
        </NarrowMenuFlyout>
      )}
    </StyledMenu>
  )
}
