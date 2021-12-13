import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const List = styled(Box)`
  padding: 10px;
`

export const AddInputWrapper = styled(Box)`
  display: grid;
  grid-gap: 10px;
`

export const PopoverContainer = styled(Box)`
  z-index: 100;
  background: ${({ theme }) => theme.bg6};
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
  min-height: 200px;
  max-height: 200px;
  position: absolute;
  min-width: 20.125rem;
  right: 1.5rem;
  margin-top: 20px;
  &:after {
    content: '';
    position: absolute;
    top: -14px;
    left: 175px;
    border-style: solid;
    border-width: 0px 15px 15px;
    border-color: ${({ theme }) => theme.bg6} transparent;
    display: block;
    width: 0;
    z-index: 1;
  }
`
export const RowWrapper = styled(Box)`
  padding: 5px 5px;
  display: grid;
  grid-template-columns: 100px minmax(auto, calc(100% - 150px)) 50px;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.text9};
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.bg6};
  }
`
