import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AIRDROP_MENU_LINK, MENU_LINK } from 'src/constants'
import { useChainId } from 'src/hooks'
import { shouldHideChildItem } from 'src/utils'
import AirdropUI from '../Airdrop2/airdrop'
import HederaAirdropUI from '../Airdrop2/hederaAirdrop'
export type AirdropProps = Record<'type', AIRDROP_MENU_LINK>

const Airdrop = () => {
  const params = useParams<AirdropProps>()
  const chainId = useChainId()
  const navigate = useNavigate()

  useEffect(() => {
    if (chainId && shouldHideChildItem(chainId, MENU_LINK.airdrop, params?.type as AIRDROP_MENU_LINK)) {
      navigate('/')
    }
  }, [chainId, params?.type])

  if (params?.type === AIRDROP_MENU_LINK.evmAirdrops) {
    return <AirdropUI />
  }

  if (params?.type === AIRDROP_MENU_LINK.hederaAirdrops) {
    return <HederaAirdropUI />
  }

  return <AirdropUI />
}
export default Airdrop
