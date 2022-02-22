import React, { useState } from 'react'
import { PageWrapper, BoxWrapper } from './styleds'
import { Text, Box } from '@0xkilo/components'
// import { ChainId } from '@antiyro/sdk'
// import FtmLogo from '../../../assets/images/ftm-logo.png'
import { useActiveWeb3React } from 'src/hooks'
// import { ChainId } from '@antiyro/sdk'
// import { ButtonToConnect, ButtonBuyFTM, ButtonCheckEligibility, ButtonChangeChain } from './ButtonsType'
import { BoxNotConnected, BoxCheckEligibility, BoxBuyFTM, BoxGoToFTM, BoxClaimReward  } from './BoxesType'

const AirdropUI: React.FC = () => {
    let { account } = useActiveWeb3React()
    console.log('account',account)
    // const [selected, setSelected] = useState<number>(0);
    // const [button1, setButton1] = useState<any>("outline");
    // const [button2, setButton2] = useState<any>("outline");
    // const [button3, setButton3] = useState<any>("outline");


    // const selectAmount = (amount: number) => {
    //     setSelected(amount)
    //     if (amount === 0.1)
    //     {
    //         setButton1("primary")
    //         setButton2("outline")
    //         setButton3("outline")
    //     }
    //     else if (amount === 0.5)
    //     {
    //         setButton1("outline")
    //         setButton2("primary")
    //         setButton3("outline")
    //     }
    //     else if (amount === 1)
    //     {
    //         setButton1("outline")
    //         setButton2("outline")
    //         setButton3("primary")
    //     }
    // }
    // console.log(selected)

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

    // const renderClaimBox = () => {

    //     return (
    //         <BoxClaimReward />
    //     )
    // }


    
    // const renderBox = () => {
    //     if (!CHAINS[chainId || ChainId.AVALANCHE].airdrop_active) {
    //         return (
    //             <ClaimBox>
    //                 <span style={{display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "20px"}}>
    //                     <Text fontSize={28} fontWeight={700} lineHeight="33px" color="text10">
    //                         Claim fanPNG
    //                     </Text>
    //                     <StyledLogo src={FtmLogo} size={"50px"}/>
    //                 </span>
    //                 <Separator />
    //                 <span style={{padding: "20px"}}></span>
    //                 <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
    //                     Let's check if you are eligible!
    //                 </Text>
    //                 <span style={{padding: "20px"}}></span>
    //                 {/* {renderButton()} */}
    //                 {!account ? (
    //                     <ButtonToConnect />
    //                 ) : (
    //                     <ButtonCheckEligibility />
    //                 )}
                    
    //                 <span style={{textAlign: "center"}}>
    //                     <Text fontSize={14} fontWeight={500} lineHeight="35px" color="text8">
    //                         To be eligible or not to be eligible...
    //                     </Text>
    //                 </span>
    //             </ClaimBox>
    //         )
    //         }
    //         else {
    //             return (
    //                 <ClaimBox>
    //                     <span style={{display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "20px"}}>
    //                         <Text fontSize={28} fontWeight={700} lineHeight="33px" color="text10">
    //                             You are eligible
    //                         </Text>
    //                         <StyledLogo src={FtmLogo} size={"50px"}/>
    //                     </span>
    //                     <Separator />
    //                     <Text fontSize={12} fontWeight={500} lineHeight="18px" color="text10" mb="15px">
    //                         You are going to need gas over there. Choose the amount you wish to spend:
    //                     </Text>
    //                     <BoxWrapper>
    //                         <Button variant={button1} color='white' height='39px' borderColor="white" onClick={() => {selectAmount(0.1)}}>
    //                             <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '15px'}}>0.1 AVAX</span>
    //                         </Button>
    //                         <Button variant={button2} color='white' height='39px' borderColor="white" onClick={() => {selectAmount(0.5)}}>
    //                             <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '15px' }}>0.5 AVAX</span>
    //                         </Button>
    //                         <Button variant={button3} color='white' height='39px' borderColor="white" onClick={() => {selectAmount(1)}}>
    //                             <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '15px' }}>1 AVAX</span>
    //                         </Button>
    //                     </BoxWrapper>
    //                     <ButtonBuyFTM />
    //                     {/* {renderButton()} */}
    //                     <span style={{textAlign: "center"}}>
    //                         <Text fontSize={14} fontWeight={500} lineHeight="35px" color="text8">
    //                             To be eligible or not to be eligible...
    //                         </Text>
    //                     </span>
    //                 </ClaimBox>

    //             )
    //         }
        
    //     }

        // const renderBoxChangeChain = () => {
        //     return (
        //         <ClaimBox>
        //             <span style={{display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "20px"}}>
        //                 <Text fontSize={28} fontWeight={700} lineHeight="33px" color="text10">
        //                     You are eligible
        //                 </Text>
        //                 <StyledLogo src={FtmLogo} size={"50px"}/>
        //             </span>
        //             <Separator />
        //             <span style={{padding: "20px"}}></span>
        //             <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
        //                 Congratulations. You successfully bought FTM. Now let's go crosschain!
        //             </Text>
        //             <span style={{padding: "20px"}}></span>
        //             <ButtonChangeChain />
        //             <span style={{textAlign: "center"}}>
        //                 <Text fontSize={14} fontWeight={500} lineHeight="35px" color="text8">
        //                     To be eligible or not to be eligible...
        //                 </Text>
        //             </span>
        //         </ClaimBox>
        //     )
        // }
    
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
                {/* FIRST BOX */}
                    {/* {renderBoxChangeChain()} */}
                {/* SECOND BOX */}
                    {
                        renderBoxes()
                    }

                {/* THIRD BOX */}
                    {/* {renderBox()} */}

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