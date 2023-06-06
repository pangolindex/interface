import {
  Box,
  shortenAddress,
  Text,
  WalletModal,
  getEtherscanLink,
  useModalOpen,
  useWalletModalToggle,
  ApplicationModal,
  useActiveWeb3React
} from '@pangolindex/components'
import React, { useCallback, useContext } from 'react'
import { ExternalLink as LinkIcon } from 'react-feather'
import { useChainId } from 'src/hooks'
import { ThemeContext } from 'styled-components'
import { AccountLink, Copy, ToggleWalletButton, WalletIcon } from './styled'

const MobileWeb3Status: React.FC = () => {
  const { account } = useActiveWeb3React()

  const chainId = useChainId()

  const theme = useContext(ThemeContext)

  const walletModalOpen = useModalOpen(ApplicationModal.WALLET)
  const toggleWalletModal = useWalletModalToggle()

  const onWalletConnect = useCallback(() => {
    toggleWalletModal()
  }, [toggleWalletModal])

  return (
    <>
      {account ? (
        <Box display="flex" alignItems="center" width="100%" height="100%" justifyContent="space-between">
          <ToggleWalletButton variant="plain" onClick={toggleWalletModal} width="auto">
            <Box width="20px" height="23px">
              <WalletIcon />
            </Box>
            <Text fontSize="14px" color="text1" fontWeight={500}>
              {shortenAddress(account, chainId, 10)}
            </Text>
          </ToggleWalletButton>
          <Box display="flex" flexDirection="row">
            <AccountLink href={getEtherscanLink(chainId, account, 'address')}>
              <LinkIcon size={20} color={theme.text1} />
            </AccountLink>
            <Copy toCopy={account} size="20px" color={theme.text1} />
          </Box>
        </Box>
      ) : (
        <Box display="flex" justifyContent="center" width="100%" height="100%">
          <ToggleWalletButton variant="primary" onClick={toggleWalletModal} width="100%">
            <WalletIcon color="black" />
            Connect Wallet
          </ToggleWalletButton>
        </Box>
      )}
      <WalletModal open={walletModalOpen} closeModal={toggleWalletModal} onWalletConnect={onWalletConnect} />
    </>
  )
}

export default MobileWeb3Status
