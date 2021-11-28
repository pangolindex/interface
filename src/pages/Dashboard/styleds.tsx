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

// portfolio section
export const PortfolioToken = styled(Box)`
  display: flex;
  align-items: center;
  font-size: 64px;
  line-height: 97px;
  color: ${({ theme }) => theme.text7};
  margin-top: 28px;
`

export const PortfolioTokenPercent = styled(Box)`
  font-size: 16px;
  line-height: 24px;

  color: #18c145;
  background: #063312;
  border-radius: 8px;
  margin-left: 26px;
  padding: 5px 14px;
`

export const PortfolioInfo = styled(Box)`
  display: flex;
  align-items: center;
  font-size: 16px;
  line-height: 24px;

  color: ${({ theme }) => theme.text8};
`

// news section
export const NewsSection = styled(Box)<{ img: string }>`
  position: relative;
  background-color: ${({ theme }) => theme.bg2};
  background-image: url(${props => props.img});
  background-repeat: no-repeat;
  background-position: bottom right;
  width: 100%;
  height: 100%;
  border-radius: 8px;

  & .slick-slider {
    padding: 110px 20px;

    .slick-dots {
      bottom: 0px;
    }
  }
`

export const NewsTitle = styled(Box)`
  color: ${({ theme }) => theme.text7};
  position: absolute;
  top: 0px;
  left: 0px;
  font-weight: bold;
  font-size: 32px;
  line-height: 48px;
  padding: 20px;
  background: linear-gradient(0deg, #f08b43, #f08b43);
  border-radius: 5px 0px 5px 0px;
`

export const NewsContent = styled(Box)`
  color: ${({ theme }) => theme.text7};
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;
`

export const NewsDate = styled(Box)`
  font-size: 10px;
  line-height: 15px;
  display: flex;
  align-items: center;
  color: #929292;
  margin-top: 15px;
`

export const SlickNext = styled(Box)<{ onClick: () => void }>`
  background: #f08b43;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
  z-index: 9999;
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
  padding-right: 28px;
`

export const DateRangeSelect = styled(Box)`
  display: flex;
  justify-content: space-between;
  margin-top: 18px;
`

export const DateRangeItem = styled(Box)`
  color: ${({ theme }) => theme.text8};
  font-size: 16px;
  line-height: 24px;

  &.active {
    color: ${({ theme }) => theme.text7};
  }

  &:hover {
    cursor: pointer;
  }
`

export const TokenList = styled(Box)`
  width: 100%;
  max-height: 240px;
  overflow-y: scroll;
  padding-right: 26px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #464646;
    border-radius: 2px;
  }
`

// followed wallets
export const WalletProfile = styled(Box)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text7};

  img {
    border-radius: 100px;
  }
`

export const WalletProfileAddress = styled(Box)`
  font-size: 18px;
  line-height: 27px;

  color: ${({ theme }) => theme.text7};
`

export const WalletProfileChain = styled(Box)`
  font-size: 14px;
  line-height: 21px;

  color: ${({ theme }) => theme.text7};
`

export const WalletTokens = styled(Box)`
  width: 100%;
  margin-top: 25px;
`

export const WalletAddresses = styled(Box)`
  width: 100%;
  margin-top: 25px;
`
export const Row = styled(Box)`
  width: 100%;
  color: ${({ theme }) => theme.text7};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.text5};
  padding: 10px 0;
`

export const FollowButton = styled(ButtonPrimary)`
  height: 24px;
  background: #464646;
  margin-left: 8px;
`
