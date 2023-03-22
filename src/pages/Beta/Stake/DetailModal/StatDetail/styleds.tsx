import styled from 'styled-components'

export const StateContainer = styled.div`
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  display: grid;
  width: 100%;
  align-items: center;
  margin-top: 12px;

  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 50% 50%;
    grid-gap: 8px;
  `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: repeat(3, 1fr);
    align-items: start;
  `};
`
