import styled from 'styled-components'
import { Box } from '@0xkilo/components'

export const Wrapper = styled.div`
  margin: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.bg8};
  max-width: 1080px;
  width: 1080px;
  /* max-height: 500px; */
  overflow-y: auto;
  border-radius: 10px;
`
export const PanelWrapper = styled.div`
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: max-content;
  gap: 12px;
  display: inline-grid;
  width: 100%;
  align-items: start;

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

export const HeaderGridContainer = styled(Box)`
  display: grid;
  grid-template-columns: minmax(auto, 40%) minmax(auto, 60%) minmax(auto, 5%);
  grid-gap: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.text9};
`

export const EarnWrapper = styled(Box)`
  width: 100%;
  min-width: 30%;
  max-width: 30%;
  overflow: hidden;
  padding: 10px;
`

export const DetailContainer = styled(Box)`
  overflow: hidden;
  width: 100%;
  background-color: ${({ theme }) => theme.bg2};
  padding: 40px;
  flex: 1;
`

export const TabView = styled(Box)`
  background-color: ${({ theme }) => theme.bg2};
  padding: 17px 50px;
  max-width: 155px;
  width: 100%;
`
