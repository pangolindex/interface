import React, { useState } from 'react'
import { PageWrapper, BoxWrapper } from './styleds'
import { Text, Box } from '@0xkilo/components'
import { useActiveWeb3React } from 'src/hooks'
import { BoxNotConnected, BoxCheckEligibility, BoxBuyFTM, BoxGoToFTM, BoxClaimReward  } from './BoxesType'
// import { AIRDROP_ABI } from 'src/constants/abis/airdrop'

const AirdropUI: React.FC = () => {
    let { account } = useActiveWeb3React()
    const [eligible, setEligible] = useState<boolean>(false);
    const [bought, setBought] = useState<boolean>(false);
    const [changeMyChain, setChangeChain] = useState<boolean>(false);


    const checkStatus = () => {
        setEligible(true)
    }

    const buyFTM = () => {
        setBought(true)
    }

    const changeChain = () => {
        setChangeChain(true)
    }
    console.log('changeMyChain', changeMyChain)
    console.log('bought', bought)
    console.log('eligible', eligible)
    const renderBoxes = () => {
        if (!account && !eligible && !bought && !changeMyChain) {
            return (
                <BoxNotConnected />
            )
        }
        if (account && !eligible && !bought && !changeMyChain) {
            return (
                <BoxCheckEligibility checkStatus={checkStatus} />
            )
        }
        if (account && eligible && !bought && !changeMyChain)
        {
            return (
                <BoxBuyFTM buyFTM={buyFTM} />
            )
        }
        if (account && eligible && bought && !changeMyChain)
        {
            return (
                <BoxGoToFTM changeChain={changeChain} />
            )
        }
        if (account && eligible && bought && changeMyChain)
        {
            return (
                <BoxClaimReward />
            )
        }
        else {
            return (
                <></>
            )
        }
    }

    //MAIN PAGE
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
                    {
                        renderBoxes()
                    }
                {/* <ClaimBox>
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
                    <ButtonCheckEligibility />
                </ClaimBox> */}
            </BoxWrapper>
        </PageWrapper>
    )

}

export default AirdropUI