import React, { useState } from 'react'
import { PageWrapper, BoxWrapper, ClaimBox, StyledLogo, Separator, QuestionWrapper, MainTitle } from './styleds'
import { Text, Box } from '@pangolindex/components'
import { useActiveWeb3React } from 'src/hooks'
import { BoxChangeChain, BoxCheckEligibility, BoxClaimReward, BoxNotConnected } from './BoxesType'
import { QuestionAnswer } from './QuestionBox'
import { useUserHasAvailableClaim, useUserUnclaimedAmount, useClaimCallback } from 'src/state/airdrop/hooks'
import NearLogo from 'src/assets/images/near.png'
import MoonBeamLogo from 'src/assets/images/moonbeam.png'
import Modal from 'src/components/Modal'
import Confetti from 'src/components/Confetti'
import { PngTokenAnimated } from 'src/theme'
import tokenLogo from 'src/assets/images/logo.png'
import { ColumnCenter } from 'src/components/Column'
import { CardBGImage, CardNoise, DataCard } from 'src/components/earn/styled'
import styled from 'styled-components'
import { ChainId } from "@pangolindex/sdk"

const ModalUpper = styled(DataCard)`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #ffc800 0%, #e1aa00 100%);
  padding: 0.5rem;
`
const AirdropUI: React.FC = () => {
  const { account, chainId } = useActiveWeb3React()
  const [eligible, setEligible] = useState<boolean>(false)
  // const [bought, setBought] = useState<boolean>(false);
  const [changeMyChain, setChangeChain] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const canClaim = useUserHasAvailableClaim(account)
  const claimAmount = useUserUnclaimedAmount(account)
  const amount = claimAmount?.toFixed(0, { groupSeparator: ',' })
  const { claimCallback } = useClaimCallback(account)

  const checkStatus = () => {
    if (Number(amount) > 0) {
      if (canClaim) setEligible(true)
      else setModalOpen(true)
    } else {
      setModalOpen(true)
    }
  }

  // const buyFTM = () => {
  //     setBought(true)
  // }

  const changeChain = () => {
    setChangeChain(true)
  }

  const claimPNG = () => {
    if (Number(amount) > 0)
      claimCallback()
  }
  const renderBoxes = () => {
    if (!account && !eligible && !changeMyChain) {
      return <BoxNotConnected />
    }
    if (account && !eligible && !changeMyChain ) {
      return <BoxChangeChain changeChain={changeChain} />
    }
    if (account && changeMyChain && !eligible ) {
      if (chainId === ChainId.WAGMI)
        return <BoxCheckEligibility checkStatus={checkStatus} />
      else 
        return <BoxChangeChain changeChain={changeChain} />
    }
    //BUY-FTM BOX NOT ACCESSIBLE RIGHT NOW FOR WAGMI
    // if (account && eligible && !bought && !changeMyChain)
    // {
    //     return (
    //         <BoxBuyCurrency buyFTM={buyFTM} />
    //     )
    // }
    if (account && changeMyChain && eligible ) {
      return <BoxClaimReward claimPNG={claimPNG} amount={amount} />
    } else {
      return <></>
    }
  }

  function wrappedOnDismiss() {
    setModalOpen(false)
  }
  const renderError = (modalOpen: any) => {
    return (
      <Modal isOpen={modalOpen} onDismiss={wrappedOnDismiss} maxHeight={250} minHeight={30} isBeta={true}>
        <ModalUpper>
        <CardBGImage />
        <CardNoise />
        <ColumnCenter>
          <Text
            fontSize={25}
            fontWeight={500}
            lineHeight="50px"
            color="black"
            style={{ textAlign: 'center', paddingTop: '30px' }}
          >
            Sorry, you are not eligible
          </Text>
          <PngTokenAnimated width="55px" src={tokenLogo} />
        </ColumnCenter>
        </ModalUpper>
      </Modal>
    )
  }

  return (
    <PageWrapper>
      <Box paddingBottom="20px">
        <span style={{ textAlign: 'center' }}>
          <MainTitle>
            Pangolin Going Crosschain
          </MainTitle>
          <Text fontSize={18} fontWeight={500} lineHeight="27px" color="text10">
            And we are not empty handed!
          </Text>
        </span>
      </Box>
      <BoxWrapper>
        {renderBoxes()}
        <Confetti start={Boolean(eligible)} />
        <ClaimBox>
          <span
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px' }}
          >
            <Text fontSize={28} fontWeight={700} lineHeight="33px" color="text10">
              Claim nearPNG
            </Text>
            <StyledLogo src={NearLogo} size={'50px'} />
          </span>
          <Separator />
          <span style={{ padding: '20px' }}></span>
          <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
            Coming soon...
          </Text>
          <span style={{ padding: '20px' }}></span>
          {/* <ButtonCheckEligibility /> */}
        </ClaimBox>
        <ClaimBox>
          <span
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px' }}
          >
            <Text fontSize={28} fontWeight={700} lineHeight="33px" color="text10">
              Claim moonBeam
            </Text>
            <StyledLogo src={MoonBeamLogo} size={'50px'} />
          </span>
          <Separator />
          <span style={{ padding: '20px' }}></span>
          <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
            Coming soon...
          </Text>
          <span style={{ padding: '20px' }}></span>
          {/* <ButtonCheckEligibility /> */}
        </ClaimBox>
      </BoxWrapper>
      <QuestionWrapper>
        <Text fontSize={35} fontWeight={500} lineHeight="66px" color="text10">
          HAVE QUESTIONS?
        </Text>
        <QuestionAnswer />
      </QuestionWrapper>
      {renderError(modalOpen)}
    </PageWrapper>
  )
}

export default AirdropUI
