import React from 'react'
import { PageWrapper, ClaimBox, BoxWrapper, Separator, StyledLogo } from './styleds'
import { Text, Box, Button } from '@pangolindex/components'
import FtmLogo from '../../../assets/images/ftm-logo.png'
import { useActiveWeb3React } from 'src/hooks'
import { useTranslation } from 'react-i18next'
import { useWalletModalToggle } from 'src/state/application/hooks'

const AirdropUI = () => {
    const { account } = useActiveWeb3React()
    const { t } = useTranslation()
    const toggleWalletModal = useWalletModalToggle()

    const renderButton = () => {
        if (!account) {
          return (
            <Button variant="primary" color='white' onClick={toggleWalletModal}>
              <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '20px' }}>{t('swapPage.connectWallet')}</span>
            </Button>
          )
        }
        else {
            return (
                <Button variant="primary" color='white'>
                    <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '15px' }}>CHECK IF ELIGIBLE</span>
                </Button>
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