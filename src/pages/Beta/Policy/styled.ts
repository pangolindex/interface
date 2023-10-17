import styled from 'styled-components'
import { Box } from '@honeycomb-finance/core'

export const PageWrapper = styled(Box)`
  width: 100%;
`

export const PolicyText = styled(Box)`
  margin: 10px;
  color: ${({ theme }) => theme.text1};
  & a {
    color: ${({ theme }) => theme.text1};
  }
`
