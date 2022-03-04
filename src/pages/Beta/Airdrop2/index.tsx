import React, { useState } from 'react'
import { PageWrapper, BoxWrapper, ClaimBox, StyledLogo, Separator } from './styleds'
import { Text, Box } from '@pangolindex/components'
import { useActiveWeb3React } from 'src/hooks'
import { BoxNotConnected, BoxCheckEligibility, BoxGoToFTM, BoxClaimReward } from './BoxesType'
import { useUserHasAvailableClaim, useUserUnclaimedAmount, useClaimCallback } from 'src/state/airdrop/hooks'
import NearLogo from 'src/assets/images/near.png'
import Modal from 'src/components/Modal'

const AirdropUI: React.FC = () => {
  const { account } = useActiveWeb3React()
  const [eligible, setEligible] = useState<boolean>(false)
  // const [bought, setBought] = useState<boolean>(false);
  const [changeMyChain, setChangeChain] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  //FUNCTION AIRDROP CONTRACT
  const canClaim = useUserHasAvailableClaim(account)
  const claimAmount = useUserUnclaimedAmount(account)
  const amount = claimAmount?.toFixed(0, { groupSeparator: ',' })
  const { claimCallback } = useClaimCallback(account)
  

  console.log(canClaim)

  const checkStatus = () => {
    if (canClaim) setEligible(true)
    // else window.alert('Sorry, you are not eligible')
    else {
      setModalOpen(true)
    } 
  }

  const renderError = (modalOpen: any) => {
    return (
      <Modal 
      isOpen={modalOpen} 
      onDismiss={wrappedOnDismiss} 
      maxHeight={250} 
      minHeight={50} 
      isBeta={true} 
      >
      <span style={{ textAlign: 'center', paddingTop: '40%' }}>
        <Separator />
          <Text fontSize={35} fontWeight={500} lineHeight="50px" color="text10">
            Sorry, you are not eligible
          </Text>
        <Separator style={{ marginTop: '30px' }} />
      </span>
      </Modal>
    )
  }
  function wrappedOnDismiss() {
    setModalOpen(false)
  }

  // const buyFTM = () => {
  //     setBought(true)
  // }

  const changeChain = () => {
    setChangeChain(true)
  }

  const claimPNG = () => {
    claimCallback()
  }
  const renderBoxes = () => {
    if (!account && !eligible && !changeMyChain) {
      return <BoxNotConnected />
    }
    if (account && !eligible && !changeMyChain) {
      return <BoxCheckEligibility checkStatus={checkStatus} />
    }
    //BUY-FTM BOX NOT ACCESSIBLE RIGHT NOW FOR WAGMI
    // if (account && eligible && !bought && !changeMyChain)
    // {
    //     return (
    //         <BoxBuyFTM buyFTM={buyFTM} />
    //     )
    // }
    if (account && eligible && !changeMyChain) {
      return <BoxGoToFTM changeChain={changeChain} />
    }
    if (account && eligible && changeMyChain) {
      return <BoxClaimReward claimPNG={claimPNG} amount={amount} />
    } else {
      return <></>
    }
  }

  //MAIN PAGE
  return (
    <PageWrapper>
      <Box p={70}>
        <span style={{ textAlign: 'center' }}>
          <Text fontSize={44} fontWeight={500} lineHeight="66px" color="text10">
            Pangolin Going Crosschain
          </Text>
          <Text fontSize={18} fontWeight={500} lineHeight="27px" color="text10">
            And we are not empty handed!
          </Text>
        </span>
      </Box>
      <BoxWrapper>
        {renderBoxes()}
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
      </BoxWrapper>
      {renderError(modalOpen)}
    </PageWrapper>
  )
}

export default AirdropUI
