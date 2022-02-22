import React, { useState } from 'react'
import { Text } from '@0xkilo/components'
import { ClaimBox, StyledLogo, Separator, BoxWrapper } from '../styleds'
import FtmLogo from '../../../../assets/images/ftm-logo.png'
import { ButtonToConnect, ButtonClaimReward } from '../ButtonsType'
import { Button } from '@0xkilo/components'
import Web3 from 'web3';

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

type IStatus = {
    checkStatus: () => void;
}

export const BoxCheckEligibility: React.FC<IStatus> = ({checkStatus}) => {

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
            <Button variant="primary" color='white' height='46px'>
                <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '20px' }} onClick={checkStatus}>CHECK IF ELIGIBLE</span>
            </Button>
        <span style={{textAlign: "center"}}>
            <Text fontSize={14} fontWeight={500} lineHeight="35px" color="text8">
                To be eligible or not to be eligible...
            </Text>
        </span>
    </ClaimBox>

    )
}

type IBuy = {
    buyFTM: () => void;
}
export const BoxBuyFTM: React.FC<IBuy> = ({buyFTM}) => {

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
            <Button variant="primary" color='white' height='46px' onClick={buyFTM}>
                <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '20px' }}>BUY WGM</span>
            </Button>
            <span style={{textAlign: "center"}}>
                <Text fontSize={14} fontWeight={500} lineHeight="35px" color="text8">
                    To be eligible or not to be eligible...
                </Text>
            </span>
        </ClaimBox>
    )
}

type IChangeChain = {
    changeChain: () => void;
}

export const BoxGoToFTM: React.FC<IChangeChain> = ({changeChain}) => {

    const switchNetworkFantom = async () => {
        changeChain()
        //@ts-ignore
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        web3.eth.getAccounts().then(console.log);
    
        try {
        //@ts-ignore
            await web3.currentProvider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x2B67" }],
            });
        } catch (error) {
            //@ts-ignore
            if (error.code === 4902) {
            try {
                //@ts-ignore
                await web3.currentProvider.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                    chainId: "0x2B67",
                    chainName: "WAGMI",
                    rpcUrls: ["https://api.trywagmi.xyz/rpc"],
                    nativeCurrency: {
                        name: "WGM",
                        symbol: "WGM",
                        decimals: 18,
                    },
                    blockExplorerUrls: [""],
                    },
                ],
                });
            } catch (error) {
                //@ts-ignore
                alert(error.message);
            }
            }
        }
    }

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
            <Button variant="primary" color='white' height='46px' onClick={switchNetworkFantom}>
                <span style={{ whiteSpace: 'nowrap', color: '#FFF', fontSize: '20px' }}>GO TO WAGMI</span>
            </Button>
            <span style={{textAlign: "center"}}>
                <Text fontSize={14} fontWeight={500} lineHeight="35px" color="text8">
                    To be eligible or not to be eligible...
                </Text>
            </span>
        </ClaimBox>
    )
}


export const BoxClaimReward = () => {

    return (
        <ClaimBox>
            <span style={{display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "20px"}}>
                <Text fontSize={28} fontWeight={700} lineHeight="33px" color="text10">
                    Claim Your Reward
                </Text>
                <StyledLogo src={FtmLogo} size={"50px"}/>
            </span>
            <Separator />
            <span style={{padding: "20px"}}></span>
            <Text fontSize={10} fontWeight={500} lineHeight="18px" color="text10">
                you are eligible for:
            </Text>
            <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
                2750 fanPNG
            </Text>
            <span style={{padding: "20px"}}></span>
            <ButtonClaimReward />
            <span style={{textAlign: "center"}}>
                <Text fontSize={14} fontWeight={500} lineHeight="35px" color="text8">
                    To be eligible or not to be eligible...
                </Text>
            </span>
        </ClaimBox>
    )
}

export default [BoxNotConnected, BoxCheckEligibility, BoxBuyFTM, BoxGoToFTM]