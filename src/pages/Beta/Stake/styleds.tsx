import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const PageWrapper = styled(Box)`
  width: 100%;
`

export const PageTitle = styled(Box)`
  font-weight: 500;
  font-size: 44px;
  line-height: 52px;
  color: ${({ theme }) => theme.text7};
  margin-top: 105px;
  margin-bottom: 92px;
  display: flex;
  justify-content: center;
`

export const PoolsWrapper = styled(Box)`
  display: flex;
  justify-content: center;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
  `};
`
