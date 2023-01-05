import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const PageWrapper = styled(Box)`
  width: 100%;
`

export const TopContainer = styled(Box)<{ isMainnet: boolean }>`
  display: grid;
  grid-template-columns: ${({ isMainnet }) => (isMainnet ? `50% 50%` : `100%`)};
  grid-gap: 12px;
  margin-bottom: 22px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: none;
    grid-template-rows: max-content auto;
    margin-bottom: 0px;
  `};
`

export const StatsWrapper = styled(Box)<{ isShowWatchList: boolean }>`
  display: grid;
  grid-template-rows: auto auto;
  grid-gap: ${({ isShowWatchList }) => (isShowWatchList ? `12px` : `0px`)};
  align-items: stretch;
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
