import styled from 'styled-components'
import { Box, TextInput } from '@0xkilo/components'

export const PoolsWrapper = styled(Box)`
  width: 100%;
  background-color: ${({ theme }) => theme.color8};
  padding: 10px;
  border-radius: 0px;
  overflow: hidden;
  color: ${({ theme }) => theme.text7};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding-bottom : 50px;
  `};
`

export const LoadingWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`

export const PanelWrapper = styled.div`
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: max-content;
  gap: 15px;
  display: inline-grid;
  width: 100%;
  align-items: start;
  padding-bottom: 65px;

  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    > * {
      grid-column: 1 / 4;
    }

    > * {
      &:first-child {
        width: 100%;
      }
    }
  }
`
export const SearchInput = styled(TextInput)`
  background-color: ${({ theme }) => theme.bg8};
`
export const MobileGridContainer = styled(Box)`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: grid;
    grid-template-columns: minmax(auto, 50%) minmax(auto, 50%);
    grid-gap: 8px;
    margin-bottom : 10px;
  `};
`
