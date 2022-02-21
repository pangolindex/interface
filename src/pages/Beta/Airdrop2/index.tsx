// import React from 'react'
import React, { useState } from 'react'
import { PageWrapper, ClaimBox, BoxWrapper, Separator, StyledLogo } from './styleds'
import { Text, Box, Button } from '@0xkilo/components'
import FtmLogo from '../../../assets/images/ftm-logo.png'
import { useActiveWeb3React } from 'src/hooks'
import { useTranslation } from 'react-i18next'
import { useWalletModalToggle } from 'src/state/application/hooks'
import { CHAINS } from 'src/constants/chains'
import { ChainId } from '@antiyro/sdk'

// interface Iselect {
//     amount: number;
// }

// const AirdropUI = (setSelected: Dispatch<Iselect>) => {
const AirdropUI = () => {
    const { account, chainId } = useActiveWeb3React()
    const { t } = useTranslation()
    const toggleWalletModal = useWalletModalToggle()
    const [selected, setSelected] = useState<number>(0);

    const selectAmount = (amount: number) => {
        setSelected(amount)
    }
    console.log(selected)


    const renderButton = () => {
        if (!account) {
          return (
            <Button variant="primary" color='white' height='46px' onClick={toggleWalletModal}>
              <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '20px' }}>{t('swapPage.connectWallet')}</span>
            </Button>
          )
        }
        if (account && CHAINS[chainId || ChainId.AVALANCHE].airdrop_active) {
            return (
              <Button variant="primary" color='white' height='46px'>
                <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '20px' }}>BUY FTM</span>
              </Button>
            )
          }
        else {
            return (
                <Button variant="primary" color='white' height='46px'>
                    <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '15px' }}>CHECK IF ELIGIBLE</span>
                </Button>
            )
        }
    }

    const renderBox = () => {
        if (!CHAINS[chainId || ChainId.AVALANCHE].airdrop_active) {
            return (
                <ClaimBox>
                    <span style={{display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "20px"}}>
                        <Text fontSize={28} fontWeight={700} lineHeight="33px" color="text10">
                            Claim fanPNG
                        </Text>
                        <StyledLogo src={FtmLogo} size={"50px"}/>
                    </span>
                    <Separator />
                    <span style={{padding: "20px"}}></span>
                    <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
                        Let's check if you are eligible!
                    </Text>
                    <span style={{padding: "20px"}}></span>
                    {renderButton()}
                    <span style={{textAlign: "center"}}>
                        <Text fontSize={14} fontWeight={500} lineHeight="35px" color="text8">
                            To be eligible or not to be eligible...
                        </Text>
                    </span>
                </ClaimBox>
            )
            }
            else {
                return (
                    <ClaimBox>
                        <span style={{display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "20px"}}>
                            <Text fontSize={28} fontWeight={700} lineHeight="33px" color="text10">
                                You are eligible
                            </Text>
                            <StyledLogo src={FtmLogo} size={"50px"}/>
                        </span>
                        <Separator />
                        {/* <span style={{padding: "1px"}}></span> */}
                        <Text fontSize={12} fontWeight={500} lineHeight="18px" color="text10" mb="15px">
                            You are going to need gas over there. Choose the amount you wish to spend:
                        </Text>
                        {/* <span style={{marginBottom: "10px"}}></span> */}
                        <BoxWrapper>
                            {/* <Button variant="outline" color='white' height='39px' borderColor="white"> */}
                            <Button variant="outline" color='white' height='39px' borderColor="white" onClick={() => {selectAmount(1)}}>
                                <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '15px'}}>0.1 AVAX</span>
                            </Button>
                            <Button variant="outline" color='white' height='39px' borderColor="white" onClick={() => {selectAmount(2)}}>
                                <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '15px' }}>0.5 AVAX</span>
                            </Button>
                            <Button variant="outline" color='white' height='39px' borderColor="white" onClick={() => {selectAmount(3)}}>
                                <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '15px' }}>1 AVAX</span>
                            </Button>
                        </BoxWrapper>
                        {renderButton()}
                        <span style={{textAlign: "center"}}>
                            <Text fontSize={14} fontWeight={500} lineHeight="35px" color="text8">
                                To be eligible or not to be eligible...
                            </Text>
                        </span>
                    </ClaimBox>

                )
            }
        
        }
    
    return (
        <PageWrapper>
            <Box p={70}>
                <span style={{textAlign: "center"}}>
                    <Text fontSize={44} fontWeight={500} lineHeight="66px" color="text10">
                        Pangolin Going Crosschain
                    </Text>
                    <Text fontSize={18} fontWeight={500} lineHeight="27px" color="text10">
                        And we are not empty handed!
                    </Text>
                </span>
            </Box>
            <BoxWrapper>
                {/* FIRST BOX */}

                    {renderBox()}

                {/* SECOND BOX */}
                <ClaimBox>
                    <span style={{display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "20px"}}>
                        <Text fontSize={28} fontWeight={700} lineHeight="33px" color="text10">
                            Claim fanPNG
                        </Text>
                        <StyledLogo src={FtmLogo} size={"50px"}/>
                    </span>
                    <Separator />
                    <span style={{padding: "20px"}}></span>
                    <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
                        Let's check if you are eligible!
                    </Text>
                    <span style={{padding: "20px"}}></span>
                    {renderButton()}
                </ClaimBox>
                {/* THIRD BOX */}
                <ClaimBox>
                    <span style={{display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "20px"}}>
                        <Text fontSize={28} fontWeight={700} lineHeight="33px" color="text10">
                            Claim fanPNG
                        </Text>
                        <StyledLogo src={FtmLogo} size={"50px"}/>
                    </span>
                    <Separator />
                    <span style={{padding: "20px"}}></span>
                    <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
                        Let's check if you are eligible!
                    </Text>
                    <span style={{padding: "20px"}}></span>
                    {renderButton()}
                </ClaimBox>
            </BoxWrapper>
        </PageWrapper>
    )

}

export default AirdropUI