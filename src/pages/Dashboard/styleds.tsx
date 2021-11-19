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
  margin-bottom: 22px;
  display: flex;
`

export const BottomContainerWrapper = styled(Box)`
  width: 100%;
`

export const Card = styled(Box)`
  width: 100%;
  padding: 25px 30px;
  margin-right: 22px;
  background: #111111;
  border-radius: 8px;
`

export const CardHeader = styled(Box)`
  width: 100%;
  color: ${({ theme }) => theme.text7};
  font-size: 32px;
  line-height: 48px;
  display: flex;
`

export const CardBody = styled(Box)`
  width: 100%;
  color: ${({ theme }) => theme.text7};
`

export const Label = styled(Box)`
  font-size: 14px;
  line-height: 21px;

  color: #717171;
`

export const Value = styled(Box)`
  font-size: 24px;
  line-height: 36px;

  color: #e6e9ec;
`
