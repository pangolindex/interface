import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const Content = styled(Box)<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  color: ${({ theme }) => theme.text8};
  font-size: 14px;
  font-weight: 500;
  & a {
    color: ${({ theme }) => theme.text8};
  }
`
