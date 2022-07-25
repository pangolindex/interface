import styled from 'styled-components'
import { Box } from '@pangolindex/components'

export const PageWrapper = styled(Box)`
  width: 100%;
  padding-top: 25px;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 70% 30%;
  grid-template-areas:
    'details stake'
    'images stake';

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 100%;
    grid-template-areas:
      'details'
      'stake'
      'images';
  `};
`
