import React from 'react'
import { Box, Button, Text, useTranslation } from '@pangolindex/components'
import { Wrapper } from '../styleds'
import { Chain } from '@pangolindex/sdk'
import { useWalletModalToggle } from 'src/state/application/hooks'
import Title from '../Title'

interface Props {
  chain: Chain
  title?: string
}

const NotConnected: React.FC<Props> = ({ chain, title }) => {
  const toggleWalletModal = useWalletModalToggle()
  const { t } = useTranslation()
  return (
    <Wrapper>
      <Title chain={chain} title={title || `Claim ${chain.png_symbol}`} />
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="150px" flex={1}>
        <Text fontSize={16} fontWeight={500} lineHeight="18px" color="text10">
          Let&apos;s check if you are eligible!
        </Text>
      </Box>
      <Button variant="primary" color="black" height="46px" onClick={toggleWalletModal}>
        {t('swapPage.connectWallet')}
      </Button>
    </Wrapper>
  )
}

export default NotConnected
