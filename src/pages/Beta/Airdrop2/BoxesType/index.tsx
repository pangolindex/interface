import React, { useState } from 'react'
import { Text } from '@0xkilo/components'
import { ClaimBox, StyledLogo, Separator, BoxWrapper } from '../styleds'
import FtmLogo from '../../../../assets/images/ftm-logo.png'
import { ButtonToConnect, ButtonCheckEligibility, ButtonBuyFTM, ButtonChangeChain } from '../ButtonsType'
import { Button } from '@0xkilo/components'

export const BoxNotConnected = () => {

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
            <ButtonToConnect />
        <span style={{textAlign: "center"}}>
            <Text fontSize={14} fontWeight={500} lineHeight="35px" color="text8">
                To be eligible or not to be eligible...
            </Text>
        </span>
    </ClaimBox>

    )
}

export const BoxCheckEligibility: React.FC = () => {

    const [eligible, setEligible] = useState<boolean>(false);
    const checkStatus = () => {
        setEligible(true)
    }
    console.log(eligible)

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
            <ButtonCheckEligibility checkStatus={checkStatus} />
        <span style={{textAlign: "center"}}>
            <Text fontSize={14} fontWeight={500} lineHeight="35px" color="text8">
                To be eligible or not to be eligible...
            </Text>
        </span>
    </ClaimBox>

    )
}

export const BoxBuyFTM = () => {
    const [selected, setSelected] = useState<number>(0);
    const [button1, setButton1] = useState<any>("outline");
    const [button2, setButton2] = useState<any>("outline");
    const [button3, setButton3] = useState<any>("outline");

    const selectAmount = (amount: number) => {
        setSelected(amount)
        if (amount === 0.1)
        {
            setButton1("primary")
            setButton2("outline")
            setButton3("outline")
        }
        else if (amount === 0.5)
        {
            setButton1("outline")
            setButton2("primary")
            setButton3("outline")
        }
        else if (amount === 1)
        {
            setButton1("outline")
            setButton2("outline")
            setButton3("primary")
        }
    }
    console.log(selected)
    return (
        <ClaimBox>
            <span style={{display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "20px"}}>
                <Text fontSize={28} fontWeight={700} lineHeight="33px" color="text10">
                    You are eligible
                </Text>
                <StyledLogo src={FtmLogo} size={"50px"}/>
            </span>
            <Separator />
            <Text fontSize={12} fontWeight={500} lineHeight="18px" color="text10" mb="15px">
                You are going to need gas over there. Choose the amount you wish to spend:
            </Text>
            <BoxWrapper>
                <Button variant={button1} color='white' height='39px' borderColor="white" onClick={() => {selectAmount(0.1)}}>
                    <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '15px'}}>0.1 AVAX</span>
                </Button>
                <Button variant={button2} color='white' height='39px' borderColor="white" onClick={() => {selectAmount(0.5)}}>
                    <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '15px' }}>0.5 AVAX</span>
                </Button>
                <Button variant={button3} color='white' height='39px' borderColor="white" onClick={() => {selectAmount(1)}}>
                    <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '15px' }}>1 AVAX</span>
                </Button>
            </BoxWrapper>
            <ButtonBuyFTM />
            <span style={{textAlign: "center"}}>
                <Text fontSize={14} fontWeight={500} lineHeight="35px" color="text8">
                    To be eligible or not to be eligible...
                </Text>
            </span>
        </ClaimBox>
    )
}

export const BoxGoToFTM = () => {

    return (
        <ClaimBox>
            <span style={{display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "20px"}}>
                <Text fontSize={28} fontWeight={700} lineHeight="33px" color="text10">
                    You are eligible
                </Text>
                <StyledLogo src={FtmLogo} size={"50px"}/>
            </span>
            <Separator />
            <span style={{padding: "20px"}}></span>
            <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
                Congratulations. You successfully bought FTM. Now let's go crosschain!
            </Text>
            <span style={{padding: "20px"}}></span>
            <ButtonChangeChain />
            <span style={{textAlign: "center"}}>
                <Text fontSize={14} fontWeight={500} lineHeight="35px" color="text8">
                    To be eligible or not to be eligible...
                </Text>
            </span>
        </ClaimBox>
    )
}


export default [BoxNotConnected, BoxCheckEligibility]