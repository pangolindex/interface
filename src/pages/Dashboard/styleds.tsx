import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const FlexWrapper = styled(Box)`
  display: flex;
`

export const PageWrapper = styled(Box)`
  width: 100%;
`

export const TopContainer = styled(Box)`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 12px;
  margin-bottom: 22px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: none;
    grid-template-rows: max-content auto;
  `};
`

export const StatsWrapper = styled(Box)`
  display: grid;
  grid-template-rows: auto auto;
  grid-gap: 12px;
`

export const PageTitle = styled.div`
  font-size: 36px;
  line-height: 56px;
  color: ${({ theme }) => theme.text7};
`

export const PageDescription = styled.div`
  font-size: 24px;
  line-height: 42px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.text8};
`

export const Card = styled(Box)`
  width: 100%;
  padding: 25px 30px;
  margin-right: 22px;
  background: ${({ theme }) => theme.bg2};
  border-radius: 8px;

  &:last-child {
    margin-right: 0px;
  }
`

export const CardHeader = styled(Box)`
  width: 100%;
  color: ${({ theme }) => theme.text7};
  font-size: 32px;
  line-height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 13px;
`

export const CardBody = styled(Box)`
  width: 100%;
  color: ${({ theme }) => theme.text7};
`
