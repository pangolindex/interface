import styled from 'styled-components'
import { Box } from '@pangolindex/components'

export const PageWrapper = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: start;
  gap: 20px;
`

export const Ibridge = styled(Box)`
  background-color: #111111;
  width: 30%;
  border-radius: 16px;
  max-height: 475px;
`

export const Separator = styled(Box)`
  margin-top: 25px;

`
export const SeparatorBorder = styled(Box)`
  margin-top: 15px;
  margin-bottom: 35px;
  border: 1px solid #353535;
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
export const StyledLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

export const QuestionBox = styled(Box)`
  background-color: #111111;
  padding: 30px;
  cursor: pointer;
  width: 70%;
`

export const TableContent = styled(Box)`
  background-color: #212427;
  padding: 20px;
  width: 30%
  cursor: pointer;
`

export const FullBox = styled(Box)`
  display: flex;
  min-width: 70%;
  max-width: 70%;
  min-height: 90vh;
`