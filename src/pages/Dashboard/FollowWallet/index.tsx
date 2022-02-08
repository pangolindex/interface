import React from 'react'
import { useTranslation } from 'react-i18next'
import makeBlockie from 'ethereum-blockies-base64'

import DeleteIcon from 'src/assets/svg/delete.svg'

import { Card, CardHeader, CardBody, FlexWrapper, ContainerRight } from '../styleds'
import {
  AddNewCoinWallet,
  WalletProfile,
  WalletProfileAddress,
  WalletProfileChain,
  WalletTokens,
  WalletAddresses,
  Row,
  FollowButton,
  IconButton,
  ContainerLeftFollowed
} from './styleds'

export default function FollowedWallet() {
  const { t } = useTranslation()
  return (
    <Card>
      <CardHeader>
        {t('dashboardPage.followedWallets')}
        <AddNewCoinWallet style={{ width: '200px' }}>
          + <span>Add New Address</span>
        </AddNewCoinWallet>
      </CardHeader>
      <CardBody>
        <FlexWrapper>
          <ContainerLeftFollowed>
            <WalletProfile>
              <img
                width={56}
                src={makeBlockie('0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8')}
                style={{ marginRight: '12px' }}
                alt="0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8"
              />
              <div>
                <WalletProfileAddress>0x372E6…A63B4</WalletProfileAddress>
                <WalletProfileChain>C-Chain Wallet</WalletProfileChain>
              </div>
            </WalletProfile>
            <WalletTokens>
              <Row type="th">
                <div>Type</div>
                <div>Name</div>
                <div>Worth</div>
              </Row>
              <Row>
                <div>Coin</div>
                <div>Avax</div>
                <div>207,542$</div>
              </Row>
              <Row>
                <div>Coin</div>
                <div>Avax</div>
                <div>207,542$</div>
              </Row>
              <Row>
                <div>Coin</div>
                <div>Avax</div>
                <div>207,542$</div>
              </Row>
            </WalletTokens>
          </ContainerLeftFollowed>
          <ContainerRight>
            <WalletAddresses>
              <Row type="th">
                <div>Address</div>
                <div>Worth</div>
                <div>Interact</div>
              </Row>
              <Row>
                <div>0x372E6…A63B4</div>
                <div>251,235.25$</div>
                <FlexWrapper>
                  <FollowButton variant="primary" follow={false}>
                    Unfollow
                  </FollowButton>
                  <IconButton variant="secondary">
                    <img width={'15px'} src={DeleteIcon} alt="delete" />
                  </IconButton>
                </FlexWrapper>
              </Row>
              <Row>
                <div>0x372E6…A63B4</div>
                <div>251,235.25$</div>
                <FlexWrapper>
                  <FollowButton variant="primary" follow={true}>
                    Follow
                  </FollowButton>
                  <IconButton variant="secondary">
                    <img width={'15px'} src={DeleteIcon} alt="delete" />
                  </IconButton>
                </FlexWrapper>
              </Row>
              <Row>
                <div>0x372E6…A63B4</div>
                <div>251,235.25$</div>
                <FlexWrapper>
                  <FollowButton variant="primary" follow={false} height="24px">
                    Unfollow
                  </FollowButton>
                  <IconButton variant="secondary">
                    <img width={'15px'} src={DeleteIcon} alt="delete" height="24px" />
                  </IconButton>
                </FlexWrapper>
              </Row>
            </WalletAddresses>
          </ContainerRight>
        </FlexWrapper>
      </CardBody>
    </Card>
  )
}
