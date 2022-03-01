import { Box, Text } from '@0xkilo/components'
import styled from 'styled-components'

export const Warning = styled(Box)`
  padding: 10px;
`

export const List = styled(Box)`
  padding: 10px;
`

export const AddInputWrapper = styled(Box)`
  display: grid;
  grid-template-columns: auto 100px;
  grid-gap: 10px;
`

export const RowRoot = styled(Box)`
  display: grid;
  grid-template-columns: max-content auto max-content max-content;
  grid-gap: 10px;
  padding: 15px 0px;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);

  &:last-child {
    border-bottom: 0px solid;
  }
`

export const ListLogo = styled.img<{ size: number }>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
`

export const DownArrow = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.text5};
  color: ${({ theme }) => theme.text1};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

export const PopoverContainer = styled.div`
  z-index: 100;
  background: ${({ theme }) => theme.bg2};
  border: 1px solid ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  color: ${({ theme }) => theme.text2};
  border-radius: 0.5rem;
  padding: 5px;
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 8px;
  font-size: 1rem;
  text-align: left;
`
export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.bg3};
`

export const ViewLink = styled(Text)<{ disabled?: boolean }>`
  text-decoration: none;
  cursor: pointer;
  pointer-events: ${({ disabled }) => disabled && 'none'};
`
