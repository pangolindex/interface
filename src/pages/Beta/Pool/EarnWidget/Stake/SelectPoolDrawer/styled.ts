import styled from 'styled-components'
import { Text } from '@pangolindex/components'

export const CurrencyList = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
`

export const CurrencyRowRoot = styled.div<{ disabled: boolean }>`
  min-height: 56px;
  font-size: 16px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;

  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && theme.bg3};
  }

  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`

export const Balance = styled(Text)`
  justify-self: flex-end;
  white-space: nowrap;
`
