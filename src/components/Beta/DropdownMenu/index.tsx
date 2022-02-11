import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useOnClickOutside } from 'src/hooks/useOnClickOutside'
import { ChevronDown } from 'react-feather'
import { StyledMenu, StyledMenuButton, NarrowMenuFlyout, MenuLink } from './styleds'

type Props = {
  value: string
  onSelect: (value: string) => void
  title?: string
  options: Array<{ label: string; value: any }>
  height?: string
}

const DropdownMenu: React.FC<Props> = ({ value, onSelect, title, options, height }) => {
  const node = useRef<HTMLDivElement>()

  const [open, setOpen] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<string>('')

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  useOnClickOutside(node, open ? handleClose : undefined)

  useEffect(() => {
    if (value !== '') {
      const matchOption = (options || []).find(t => t.value === value)

      setSelectedOption(matchOption?.label || '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={() => setOpen(!open)} height={height}>
        {selectedOption ? selectedOption : title} <ChevronDown size="16" />
      </StyledMenuButton>

      {open && (
        <NarrowMenuFlyout>
          {(options || []).map((option, i) => (
            <MenuLink key={i} onClick={() => onSelect(option.value)}>
              {option.label}
            </MenuLink>
          ))}
        </NarrowMenuFlyout>
      )}
    </StyledMenu>
  )
}

export default DropdownMenu
