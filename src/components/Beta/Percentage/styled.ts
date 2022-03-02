import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const PValue = styled(Box)<{ isActive: boolean }>`
  margin-left: 3px;
  margin-right: 3px;
  align-items: center;
  display: flex;
  width: 100%;
  font-size: 12px;
  padding: 5px;
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme, isActive }) => (isActive ? theme.primary : theme.color5)};
  border: ${({ theme, isActive }) => (isActive ? 0 : `1px solid ${theme.text1}`)};
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  justify-content: center;
`
