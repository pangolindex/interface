import styled from 'styled-components'
import { Box, Button } from '@pangolindex/components'

export const WalletText = styled(Box)`
  color: ${({ theme }) => theme.text1};
  margin-top: 4px;
`

export const BackButton = styled(Button)`
  color: ${({ theme }) => theme.text1};
  max-width: 50px;
`

export const BackRow = styled.div`
  width: 100%;
`

export const Container = styled(Box)`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 12px;
  margin-bottom: 22px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: none;
    grid-template-rows: max-content auto;
    margin-bottom: 0px;
  `};
`
