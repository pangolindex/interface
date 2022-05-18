import React, { useState } from 'react'
import { ALL_CHAINS, Chain } from '@pangolindex/sdk'
import { Box, Text, ToggleButtons } from '@pangolindex/components'

import Modal from 'src/components/Beta/Modal'
import { ChainsList, ChainButton, Frame, Logo, CloseButton, ButtonFrame } from './styled'
import { Scrollbars } from 'react-custom-scrollbars'

interface Props {
  open: boolean
  closeModal: () => void
}

interface MetamaskError {
  code: number
  message: string
}

export default function NetworkSelection({ open, closeModal }: Props) {
  const [mainnet, setMainnet] = useState(true)

  const { ethereum } = window
  const isMetaMask = ethereum && ethereum.isMetaMask

  const chains = ALL_CHAINS.filter(chain => chain.pangolin_is_live && chain.mainnet === mainnet)

  const chainListHeight = chains.length / 2 <= 1 ? 48 : chains.length / 2 <= 2 ? 116 : 184

  const changeChain = async (chain: Chain) => {
    if (isMetaMask && ethereum) {
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chain.chain_id.toString(16)}` }]
        })
      } catch (error) {
        // This error code indicates that the chain has not been added to MetaMask.
        const metamask = error as MetamaskError
        if (metamask.code === 4902) {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: chain.name,
                chainId: `0x${chain.chain_id.toString(16)}`,
                //nativeCurrency: chain.nativeCurrency,
                rpcUrls: [chain.rpc_uri],
                blockExplorerUrls: chain.blockExplorerUrls,
                iconUrls: chain.logo,
                nativeCurrency: chain.nativeCurrency
              }
            ]
          })
        }
      }
    }
  }

  return (
    <Modal isOpen={open} onDismiss={closeModal}>
      <Frame>
        <CloseButton onClick={closeModal} />
        <Text color="text1" fontSize="24px" marginBottom={20} style={{ gridArea: 'text' }}>
          Select Chain
        </Text>
        <ButtonFrame>
          <ToggleButtons
            options={['Mainnet', 'Testnet']}
            value={mainnet === true ? 'Mainnet' : 'Testnet'}
            onChange={value => {
              setMainnet(value === 'Mainnet')
            }}
          />
        </ButtonFrame>
        <Box height={chainListHeight} style={{ gridArea: 'chains' }}>
          <Scrollbars>
            <ChainsList>
              {chains.map((chain, index) => (
                <ChainButton key={index} onClick={() => changeChain(chain)}>
                  <Logo src={chain.logo} />
                  <Text color="text1">{chain.name}</Text>
                </ChainButton>
              ))}
            </ChainsList>
          </Scrollbars>
        </Box>
      </Frame>
    </Modal>
  )
}
