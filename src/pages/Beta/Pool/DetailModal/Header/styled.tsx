import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const HeaderRoot = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.text9};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    border-bottom: none;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  `};
`

export const StatsWrapper = styled(Box)`
  display: grid;
  grid-template-columns: repeat(5, auto);
  grid-gap: 20px;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    grid-gap: 10px;
    margin-top: 10px;
    grid-template-columns: 50% 50%;
`};
`

export const HeaderWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%
  `};
`
