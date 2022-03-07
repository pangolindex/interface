import styled from 'styled-components'
import { Box } from '@pangolindex/components'

export const PageWrapper = styled(Box)`
  width: 100%;
`

export const Ibridge = styled(Box)`
  background-color: #111111;
  width: 395px;
  height: 490px;
  border-radius: 16px;
  position: absolute;
  left: 70%;
  top: 20%;
`

export const Separator = styled(Box)`
  margin-top: 25px;
`

export const ChainSelect = styled(Box)`
  align-items: center;
  height: 3rem;
  font-size: 20px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;
  background-color: #1c1c1c;
  margin-top: 5px;
  border-radius: 8px;
`

export const MaxButton = styled.div<{ width: string }>`
  padding: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  color: #8c8d93;
`
export const WrapButton = styled(Box)`
  display: flex;
`
