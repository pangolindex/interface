import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const HeaderRoot = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.text9};
`

export const StatsWrapper = styled(Box)`
  display: grid;
  grid-template-columns: repeat(4, auto);
  grid-gap: 20px;
  align-items: center;
`
