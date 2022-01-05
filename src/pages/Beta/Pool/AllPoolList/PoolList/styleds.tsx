import styled from 'styled-components'
import { Box, TextInput } from '@pangolindex/components'

export const PageWrapper = styled(Box)`
  width: 100%;
  background-color: ${({ theme }) => theme.bg2};
  padding: 10px;
  border-radius: 0px 10px 10px 0px;
  overflow: hidden;
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
