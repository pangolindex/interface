import React, {useEffect, useRef, useState, createRef} from 'react'
import styled from 'styled-components'
import {ChevronDown} from 'react-feather'
import Row, {RowBetween} from '../Row'
import {Text} from 'rebass'
import {useOnClickOutside} from '../../hooks/useOnClickOutside'


const ContainerButton = styled.button`
  display: flex;
  flex-direction: column;
  font-weight: 500;
  border-radius: 12px;
  width: 100%;
  padding: 18px;
  background-color: transparent;
  outline: none;
  border: 1px solid ${({theme}) => theme.bg2};
  color: ${({theme}) => theme.text1};
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;

  &:focus {
    box-shadow: 0 0 0 1px ${({theme}) => theme.bg4};
  }

  &:hover {
    box-shadow: 0 0 0 1px ${({theme}) => theme.bg4};
  }

  &:active {
    box-shadow: 0 0 0 1px ${({theme}) => theme.bg4};
  }

  &:disabled {
    opacity: 50%;
    cursor: auto;
  }

  > * {
    user-select: none;
  }
`

export const Icon = styled.img`
  height: 24px;
  margin-left: 5px;
`

const Items = styled.div`
  display: none;
  position: absolute;
  top: 65px;
  width: 100%;
  z-index: 99;
  background-color: ${({theme}) => theme.bg1};
  border: 1px solid ${({theme}) => theme.bg4};
  border-radius: 12px;
  padding: 4px;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 300px;
`

const Item = styled.div`
  height: 45px;
  display: flex;
  align-items: center;
  paddingLeft: 20px;
  font-size: 1.25rem;
  border-radius: 12px;
  font-weight: 400;

  &:hover {
    background-color: ${({theme}) => theme.bg4};
  }
`

const SearchInput = styled.input`
  height: 45px;
  border: none;
  border-radius: 15px;
  color: ${({theme}) => theme.text1};
  font-weight: 500;
  font-size: 1.25rem;
  background-color: ${({theme}) => theme.bg2};
  width: 100%;
  padding-left: 20px;

  &:focus {
    outline: none;
  }
`

export interface OptionType {
  label: string
  icon?: string

  [key: string]: any
}

export interface CustomDropdownProps {
  label?: string
  className?: string
  value?: OptionType

  onChange?(val: OptionType): void

  options: OptionType[]
  allowSearch?: boolean

  comparator?(val1: OptionType, val2: OptionType): boolean

  disabled?: boolean
}

export default function DropdownSelect({
                                         label,
                                         value,
                                         onChange,
                                         options,
                                         allowSearch = false,
                                         disabled = false,
                                         comparator = function (val1, val2) {
                                           return val1 === val2
                                         },
                                       }: CustomDropdownProps) {

  const [isOpen, setOpenState] = useState(false)
  const [isDisabled] = useState(false)
  const node = useRef<HTMLDivElement>()
  const ref = createRef<HTMLInputElement>()

  const [selectedItem, setSelectedItem] = useState<OptionType>({
    label: label,
  } as any)

  const [availableOptions, setAvailableOptions] = useState(options)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (options.length === 1) {
      const selectedItem = options[0]
      setSelectedItem(selectedItem)
      onChange && onChange(selectedItem)
    } else if (options.length > 1 && value) {
      const selectedItem = options.find((option) => comparator(option, value))
      if (selectedItem) {
        setSelectedItem(selectedItem)
        onChange && onChange(selectedItem)
      }
    }
  }, [options, comparator, onChange, value])

  useEffect(() => {
    setAvailableOptions(
      query
        ? options.filter((option) => {
          return option.label.toLowerCase().includes(query.toLowerCase())
        })
        : options
    )
  }, [query, options])

  useEffect(() => {
    ref?.current?.focus()
  }, [isOpen, ref])

  useEffect(() => {
    setAvailableOptions(options)
  }, [options])

  useOnClickOutside(node, isOpen ? () => setOpenState(false) : undefined)

  return (
    <ContainerButton
      ref={node as any}
      onMouseDown={(evt) => {
        if (!evt.currentTarget.contains(evt.target as any)) {
          setOpenState(!isOpen)
        } else {
          setOpenState(true)
        }
      }}
      type='button'
      disabled={isDisabled}
    >
      {allowSearch && isOpen ? (
        <SearchInput
          type='text'
          onChange={(el) => setQuery(el.currentTarget.value)}
          ref={ref}
        />
      ) : (
        <RowBetween>
          {selectedItem.icon ? (
            <Icon src={selectedItem.icon} alt=''/>
          ) : (
            ''
          )}

          <Row>
            <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>{selectedItem.label}</Text>
          </Row>
          <ChevronDown size={24}/>
        </RowBetween>
      )}
      <Items style={isOpen ? {display: 'initial'} : {display: 'none'}}>
        {availableOptions.map((option) => {
          return (
            <Item
              key={option.label}
              onClick={() => {
                setOpenState(false)
                setSelectedItem(option)
                onChange && onChange(option)
              }}
            >
              {option.icon ? (
                <Icon src={option.icon} alt=''/>
              ) : (
                ''
              )}
              <Row>
                <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>{option.label}</Text>
              </Row>
            </Item>
          )
        })}
      </Items>
    </ContainerButton>
  )
}

