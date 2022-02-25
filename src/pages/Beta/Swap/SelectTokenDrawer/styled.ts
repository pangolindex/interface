import styled from 'styled-components'
import { Text } from '@0xkilo/components'

export const CurrencyList = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
`

export const CurrencyRowRoot = styled.div<{ disabled: boolean; selected: boolean }>`
  min-height: 56px;
  font-size: 16px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) minmax(0, 72px);
  grid-gap: 16px;
  align-items: center;
  padding: 10px;

  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && theme.bg3};
  }

  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`

export const Balance = styled(Text)`
  justify-self: flex-end;
  white-space: nowrap;
`

export const ManageList = styled.div`
  background-color: ${({ theme }) => theme.bg1};
  padding: 10px;
  cursor: pointer;
`

export const ListLogo = styled.img<{ size: number }>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  margin-right: 10px;
`
