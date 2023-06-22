import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AIRDROP_MENU_LINK, MENU_LINK } from 'src/constants'
import { useChainId } from 'src/hooks'
import { shouldHideChildItem, switchNetwork } from 'src/utils'
import AirdropUI from '../Airdrop2/airdrop'
import HederaAirdropUI from '../Airdrop2/hederaAirdrop'
import { useWeb3React } from '@web3-react/core'
import { useWalletModalToggle } from '@pangolindex/components'
import { CHAINS, ChainId } from '@pangolindex/sdk'
export type AirdropProps = Record<'type', AIRDROP_MENU_LINK>

const Airdrop = () => {
  const params = useParams<AirdropProps>()
  const { account } = useWeb3React()
  const chainId = useChainId()
  const toggleWalletModal = useWalletModalToggle()

  useEffect(() => {
    if (!account) toggleWalletModal()
    else if (chainId && shouldHideChildItem(chainId, MENU_LINK.airdrop, params?.type as AIRDROP_MENU_LINK)) {
      switchNetwork(CHAINS[ChainId.FUJI])
    }
  }, [chainId, params?.type, account])

  if (params?.type === AIRDROP_MENU_LINK.evmAirdrops) {
    return <AirdropUI />
  }

  if (params?.type === AIRDROP_MENU_LINK.hederaAirdrops) {
    return <HederaAirdropUI />
  }

  return <AirdropUI />
}
export default Airdrop
