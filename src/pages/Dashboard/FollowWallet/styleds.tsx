import { Box, Button } from "@0xkilo/components"
import styled from 'styled-components'

import { ButtonPrimary } from '../../../components/Button'

// followed wallets
export const ContainerLeftFollowed = styled(Box)`
  width: 50%;
  margin-right: 35px;
  padding-right: 30px;
  border-right: 1px solid ${({ theme }) => theme.text8};
`

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

  color: ${({ theme }) => theme.text9};
`

export const WalletProfileChain = styled(Box)`
  font-size: 14px;
  line-height: 21px;

  color: ${({ theme }) => theme.text8};
`

export const WalletTokens = styled(Box)`
  width: 100%;
  margin-top: 25px;
`

export const WalletAddresses = styled(Box)`
  width: 100%;
  margin-top: 25px;
`
export const Row = styled(Box)<{ type?: string }>`
  width: 100%;
  color: ${props => (props.type === 'th' ? ({ theme }) => theme.text8 : ({ theme }) => theme.text9)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.text5};
  padding: 10px 0;

  & div {
    width: 40%;

    &:last-child {
      width: 20%;
      text-align: right;
    }
  }
`

export const FollowButton = styled(Button)<{ follow: boolean }>`
  height: 24px !important;
  background: ${props => (props.follow ? '#18c145' : '#717171')} !important;
  margin-left: 8px;
  padding: 5px !important;
`

export const IconButton = styled(Button)`
  height: 24px !important;
  background-color: rgba(113, 113, 113, 0.5) !important;
  padding: 5px !important;
  width: auto !important;
  margin-left: 8px;
`

export const AddNewCoinWallet = styled(ButtonPrimary)`
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
