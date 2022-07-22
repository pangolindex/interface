import React, { useState } from 'react'
import { PageWrapper, BoxWrapper, MainTitle, CenterText } from './styleds'
import { Text, Box } from '@pangolindex/components'
import { useActiveWeb3React } from 'src/hooks'
import { BoxChangeChain, BoxCheckEligibility, BoxClaimReward, BoxCommingSoon, BoxNotConnected } from './Boxes'
import { QuestionAnswer } from './QuestionBox'
import { useUserHasAvailableClaim, useUserUnclaimedAmount, useClaimCallback } from 'src/state/airdrop/hooks'
import Modal from 'src/components/Modal'
import Confetti from 'src/components/Confetti'
import { PngTokenAnimated } from 'src/theme'
import tokenLogo from 'src/assets/images/logo.png'
import { ColumnCenter } from 'src/components/Column'
import { CardBGImage, DataCard } from 'src/components/earn/styled'
import styled from 'styled-components'
import { Chain } from '@pangolindex/sdk'
import { activeAirdrops, commingSoonAirdrops } from 'src/constants/airdrop'

const ModalUpper = styled(DataCard)`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #ffc800 0%, #e1aa00 100%);
  padding: 0.5rem;
`
const AirdropUI: React.FC = () => {
  const { account, chainId } = useActiveWeb3React()
  const [eligible, setEligible] = useState<boolean>(false)

  const [changeMyChain, setChangeChain] = useState<boolean>(false)

  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const canClaim = useUserHasAvailableClaim(account)
  const claimAmount = useUserUnclaimedAmount(account)
  const amount = claimAmount?.toFixed(0, { groupSeparator: ',' })
  const { claimCallback } = useClaimCallback(account)

  const checkStatus = () => {
    if (canClaim) setEligible(true)
    else setModalOpen(true)
  }

  const changeChain = () => {
    setChangeChain(true)
  }

  const renderAirdrop = (chain: Chain, key: number) => {
    if (!account && !eligible && !changeMyChain) {
      return <BoxNotConnected key={key} chain={chain} />
    }
    if (chainId !== chain?.chain_id) {
      return <BoxChangeChain key={key} changeChain={changeChain} chain={chain} />
    }
    if (account && changeMyChain && !eligible) {
      return <BoxCheckEligibility key={key} checkStatus={checkStatus} chain={chain} />
    }
    return <BoxClaimReward key={key} claimPNG={claimCallback} amount={amount} chain={chain} />
  }

  function wrappedOnDismiss() {
    setModalOpen(false)
  }

  const renderError = (isOpened: boolean) => {
    return (
      <Modal isOpen={isOpened} onDismiss={wrappedOnDismiss} maxHeight={250} minHeight={30}>
        <ModalUpper>
          <CardBGImage />
          <ColumnCenter>
            <Text fontSize={[24, 18]} fontWeight={500} lineHeight="50px" color="black">
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
        <CenterText>
          <MainTitle>Pangolin Going Crosschain</MainTitle>
          <Text fontSize={[18, 14]} fontWeight={500} lineHeight="27px" color="text10">
            And we are not empty handed!
          </Text>
        </CenterText>
      </Box>
      <BoxWrapper>
        {activeAirdrops.map((chain, index) => renderAirdrop(chain, index))}
        <Confetti start={Boolean(eligible)} />
        {commingSoonAirdrops.map((chain, index) => (
          <BoxCommingSoon key={index} chain={chain} />
        ))}
      </BoxWrapper>
      <Box display="flex" flexDirection="column" alignItems="center" mb="20px">
        <Text fontSize={[32, 24]} fontWeight={500} lineHeight="66px" color="text10">
          HAVE QUESTIONS?
        </Text>
        <QuestionAnswer />
      </Box>
      {renderError(modalOpen)}
    </PageWrapper>
  )
}

export default AirdropUI
