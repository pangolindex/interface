import styled from 'styled-components'

export const PanelWrapper = styled.div`
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: max-content;
  gap: 12px;
  display: inline-grid;
  width: 100%;
  align-items: start;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.color2};
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    > * {
      grid-column: 1 / 6;
    }

    > * {
      &:first-child {
        width: 100%;
      }
    }
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

export const MobileStat = styled.div`
  border-radius: 10px;
  background-color: ${({ theme }) => theme.color2};
  display: none;
  padding: 10px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  display: flex;
  align-items: center;
  justify-content: space-between;
`};
`
