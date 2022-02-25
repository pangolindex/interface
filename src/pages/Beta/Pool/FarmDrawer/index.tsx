import React from 'react'
import Drawer from 'src/components/Drawer'
import { Token } from '@pangolindex/sdk'
import { useTranslation } from 'react-i18next'
import { usePair } from 'src/data/Reserves'
import Stake from '../EarnWidget/Stake'

type Props = {
  isOpen: boolean
  clickedLpTokens: Array<Token>
  onClose: () => void
  backgroundColor?: string
  version: number
  combinedApr?: number
}

const FarmDrawer: React.FC<Props> = ({ isOpen, onClose, clickedLpTokens, backgroundColor, version, combinedApr }) => {
  const { t } = useTranslation()

  const token0 = clickedLpTokens?.[0]
  const token1 = clickedLpTokens?.[1]

  const [, stakingTokenPair] = usePair(token0, token1)

  return (
    <Drawer title={t('earn.deposit')} isOpen={isOpen} onClose={onClose} backgroundColor={backgroundColor}>
      {isOpen && <Stake pair={stakingTokenPair} version={version} onComplete={onClose} type="card" combinedApr={combinedApr} />}
    </Drawer>
  )
}

export default FarmDrawer
