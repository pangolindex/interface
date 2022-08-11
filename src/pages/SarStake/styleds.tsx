import styled from 'styled-components'
import { Box } from '@pangolindex/components'

export const PageWrapper = styled(Box)`
  width: 100%;
  padding-top: 25px;
  display: grid;
  flex-grow: 1;
  grid-gap: 16px;
  grid-template-columns: 75% 25%;
  grid-template-rows: max-content 1fr;
  grid-template-areas:
    'details stake'
    'images stake';

  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  `}

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: none;
    grid-template-areas:
      'details'
      'stake'
      'images';
  `};
`
