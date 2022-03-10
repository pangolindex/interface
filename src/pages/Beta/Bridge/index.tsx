import React from 'react'
import { PageWrapper, Ibridge, ChainSelect, Separator, MaxButton, WrapButton } from './styleds'
import { Text, Box, ToggleButtons, Button } from '@pangolindex/components'
import { useActiveWeb3React } from 'src/hooks'
import { useTranslation } from 'react-i18next'
import { useWalletModalToggle } from 'src/state/application/hooks'
import { QuestionAnswer } from './QuestionBoxes'

const BridgeUI = () => {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const toggleWalletModal = useWalletModalToggle()

  const renderButton = () => {
    if (!account) {
      return (
        <Button variant="primary" color="white" onClick={toggleWalletModal}>
          <span style={{ whiteSpace: 'nowrap', color: '#000', fontSize: '20px' }}>{t('swapPage.connectWallet')}</span>
        </Button>
      )
    } else {
      return (
        <Button variant="primary" color="white">
          <span style={{ whiteSpace: 'nowrap', color: '#000', fontSize: '20px' }}>BRIDGE</span>
        </Button>
      )
    }
  }

  return (
    <PageWrapper>
      <QuestionAnswer />
      <Ibridge>
        <Box p={20}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Text fontSize={24} fontWeight={500} lineHeight="36px" color="text10">
              Cross Chain
            </Text>
            <ToggleButtons options={['Bridge', 'Swap']} />
          </Box>
          <Separator />
          <Text fontSize={16} fontWeight={500} lineHeight="24px" color="text10">
            From
          </Text>
          <ChainSelect></ChainSelect>
          <Separator />
          <Text fontSize={16} fontWeight={500} lineHeight="24px" color="text10">
            Destination
          </Text>
          <ChainSelect></ChainSelect>
          <Separator />
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Text fontSize={16} fontWeight={500} lineHeight="24px" color="text10">
              Amount
            </Text>
            <WrapButton>
              <MaxButton width="20%">25%</MaxButton>
              <MaxButton width="20%">50%</MaxButton>
              <MaxButton width="20%">75%</MaxButton>
              <MaxButton width="20%">100%</MaxButton>
            </WrapButton>
          </Box>
          <ChainSelect></ChainSelect>
          <Separator />
          {renderButton()}
        </Box>
      </Ibridge>
    </PageWrapper>
  )
}

export default BridgeUI
