import styled from 'styled-components'
import { Box } from '@pangolindex/components'

export const PageWrapper = styled(Box)`
  width: 100%;
  background-color: ${({ theme }) => theme.bg2};
  padding: 10px;
  border-radius: 0px 10px 10px 0px;
  overflow: hidden;
`

export const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

export const MobileContainer = styled(Box)`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
    width: 100%
    margin-bottom : 10px;
  `};
`
