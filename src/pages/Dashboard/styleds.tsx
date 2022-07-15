import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const PageWrapper = styled(Box)`
  width: 100%;
`

export const TopContainer = styled(Box)`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 12px;
  margin-bottom: 22px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: none;
    grid-template-rows: max-content auto;
    margin-bottom: 0px;
  `};
`

export const StatsWrapper = styled(Box)`
  display: grid;
  grid-template-rows: auto auto;
  grid-gap: 12px;
`

export const PageTitle = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.text7};

  ${({ theme }) => theme.mediaWidth.upToSmall`
   font-size: 22px;
  `};
`

export const PageDescription = styled.div`
  font-size: 18px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.text8};

  ${({ theme }) => theme.mediaWidth.upToSmall`
   font-size: 14px;
  `};
`
