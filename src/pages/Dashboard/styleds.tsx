import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const FlexWrapper = styled(Box)`
  display: flex;
`

export const PageWrapper = styled(Box)`
  width: 100%;
`

export const PageTitle = styled.div`
  font-size: 48px;
  line-height: 56px;
  margin-bottom: 12px;

  color: ${({ theme }) => theme.text7};
`

export const PageDescription = styled.div`
  font-size: 28px;
  line-height: 42px;
  margin-bottom: 30px;

  color: ${({ theme }) => theme.text8};
`

export const TopContainerWrapper = styled(Box)`
  width: 100%;
  margin: auto;
  max-width: 1200px;
  margin-bottom: 22px;
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
`

export const ContainerLeft = styled(Box)`
  width: 50%;
  margin-right: 22px;
`

export const ContainerRight = styled(Box)`
  width: 50%;
`

export const BottomContainerWrapper = styled(Box)`
  width: 100%;
`

export const Card = styled(Box)`
  padding: 3px;
  width: 100%;
  margin-bottom: 0.3rem;
  background: ${({ theme }) => theme.bg2};
  border-radius: 8px;

  &:last-child {
    margin-right: 0px;
  }
`

export const CardHeader = styled(Box)`
  width: 100%;
  color: ${({ theme }) => theme.text7};
  font-size: 24px;
  line-height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 13px;
`

export const CardBody = styled(Box)`
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.text7};
`

export const PortfolioWrapper = styled(Box)`
  display: grid;
  gap: 12;
  width: 100%;
  max-width: 600px;
`
export const WatchListWrapper = styled(Box)`
  display: grid;
  gap: 12;
  width: 100%;
  max-width: 1114px;
`
