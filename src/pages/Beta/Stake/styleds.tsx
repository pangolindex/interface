import { Box } from '@0xkilo/components'
import styled from 'styled-components'

export const PageWrapper = styled(Box)`
  width: 100%;
`

export const PageTitle = styled(Box)`
  font-weight: 500;
  font-size: 44px;
  color: ${({ theme }) => theme.text7};
  margin-top: 105px;
  margin-bottom: 92px;
  display: flex;
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
      font-size: 24px;
      text-align: center;
      margin-top: 30px;
      margin-bottom: 30px;
  `};
`

export const PoolsWrapper = styled(Box)`
  display: flex;
  justify-content: center;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
  `};
`

export const PoolCards = styled(Box)`
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  grid-gap: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-auto-columns:  minmax(0, 1fr);
    grid-auto-flow: row;
  `};
`
