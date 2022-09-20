import styled from 'styled-components'
import { Box } from '@pangolindex/components'
import { CloseIcon } from 'src/theme'

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

  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: 65% 35%;
  `}

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
export const CloseButton = styled(CloseIcon)`
  color: ${({ theme }) => theme.text1};
  position: absolute;
  right: 9px;
  top: 9px;
`

export const StyledSVG = styled(Box)`
  svg {
    width: 100%;
    height: 100%;
  }

  height: 400px;
`
