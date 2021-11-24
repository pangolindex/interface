import { Box } from '@pangolindex/components'
import { ButtonPrimary, ButtonOutlined } from '../../components/Button'
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

// earned section
export const Label = styled(Box)`
  font-size: 14px;
  line-height: 21px;
  color: #717171;
  margin-top: 12px;
`

export const Value = styled(Box)`
  font-size: 24px;
  line-height: 36px;

  color: ${({ theme }) => theme.text7};
  display: flex;
  align-items: center;

  img {
    margin-left: 9px;
  }
`

export const ValueWithInfo = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`

export const XStakeButton = styled(ButtonOutlined)`
  height: 46px;
  margin-right: 8.5px;
  box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
`

export const ClaimButton = styled(ButtonPrimary)`
  height: 46px;
`

export const CustomizePools = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 8.5px;

  a {
    color: ${({ theme }) => theme.text8};
  }
`

// coins section
export const AddNewCoinButton = styled(ButtonPrimary)`
  width: 166px;
  height: 23px;
  background: #717171;

  font-weight: normal;
  font-size: 14px;
  line-height: 16px;

  border-radius: 4px;

  span {
    margin-left: 16px;
  }
`

export const TokenChart = styled(Box)`
  width: 100%;
`

export const TokenList = styled(Box)`
  width: 100%;
`

export const TokenRow = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background: #1c1c1c;
    border-radius: 8px;
  }

  padding: 12px;
  border-bottom: 1px solid #282828;
`

export const TokenName = styled(Box)`
  font-size: 20px;
  line-height: 30px;

  color: #e6e9ec;
`

export const TokenValue = styled(Box)`
  text-align: right;
`

export const TokenPrice = styled(Box)`
  font-size: 16px;
  line-height: 24px;

  color: #e6e9ec;
`

export const TokenDiff = styled(Box)`
  font-size: 10px;
  line-height: 15px;

  color: #e84142;
`
