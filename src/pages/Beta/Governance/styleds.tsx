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
  margin-bottom: 28px;
  display: flex;
  justify-content: center;
`

export const ContentWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 960px;
  margin: auto;
`

export const About = styled(Box)`
  padding: 18px 30px 32px;
  background: ${({ theme }) => theme.bg2};
`
