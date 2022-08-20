import React from 'react'
import { Button, Text, useTranslation } from '@pangolindex/components'
import { TextBottomWrapper, SmallSeparator, Wrapper } from '../styleds'
import { Chain } from '@pangolindex/sdk'
import { useWalletModalToggle } from 'src/state/application/hooks'
import Title from '../Title'

interface Props {
  chain: Chain
}

const NotConnected: React.FC<Props> = ({ chain }) => {
  const toggleWalletModal = useWalletModalToggle()
  const { t } = useTranslation()
  return (
    <Wrapper>
      <Title chain={chain} title="Connect Your Wallet" />
      <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
        Let&apos;s check if you are eligible!
      </Text>
      <SmallSeparator />
      <Button variant="primary" color="black" height="46px" onClick={toggleWalletModal}>
        {t('swapPage.connectWallet')}
      </Button>
      <TextBottomWrapper>
        <Text fontSize={14} fontWeight={500} lineHeight="18px" color="text8">
          To be eligible or not to be eligible...
        </Text>
      </TextBottomWrapper>
    </Wrapper>
  )
}

export default NotConnected
