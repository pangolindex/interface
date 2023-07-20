import React from 'react'
import { useParams } from 'react-router-dom'
import { AIRDROP_MENU_LINK } from 'src/constants'
import AirdropUI from '../Airdrop2/airdrop'
import HederaAirdropUI from '../Airdrop2/hederaAirdrop'
export type AirdropProps = Record<'type', AIRDROP_MENU_LINK>

const Airdrop = () => {
  const params = useParams<AirdropProps>()

  if (params?.type === AIRDROP_MENU_LINK.evmAirdrops) {
    return <AirdropUI />
  }

  if (params?.type === AIRDROP_MENU_LINK.hederaAirdrops) {
    return <HederaAirdropUI />
  }

  return <AirdropUI />
}
export default Airdrop
