import styled from 'styled-components'

export const StateContainer = styled.div`
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: max-content;
  gap: 12px;
  display: inline-grid;
  width: 100%;
  align-items: start;
  margin-top: 12px;

  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    > * {
      grid-column: 1 / 3;
    }

    > * {
      &:first-child {
        width: 100%;
      }
    }
  }
`
