import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const Bar = styled(Box)`
  border-radius: 8px;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.bg8};
  margin-bottom: 30px;
`

export const BarRight = styled(Box)`
  border-radius: 8px;
  font-weight: 600;
  font-size: 18px;
  line-height: 18px;
  padding: 12px 15px;
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text8};
`
