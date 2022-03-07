import React from 'react'
import Drawer from 'src/components/Drawer'
import { Token, ChainId } from '@pangolindex/sdk'
import { useTranslation } from 'react-i18next'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import RemoveLiquidity from '../RemoveLiquidity'
import { useActiveWeb3React } from 'src/hooks'


type Props = {
  isOpen: boolean
  clickedLpTokens: Array<Token>
  onClose: () => void
  backgroundColor?: string
}

const RemoveLiquidityDrawer: React.FC<Props> = ({ isOpen, onClose, clickedLpTokens, backgroundColor }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()

  const token0 = clickedLpTokens?.[0]
  const token1 = clickedLpTokens?.[1]

  const currencyA = token0 && unwrappedToken(token0, chainId || ChainId.AVALANCHE)
  const currencyB = token1 && unwrappedToken(token1, chainId || ChainId.AVALANCHE)

  return (
    <Drawer
      title={t('navigationTabs.removeLiquidity')}
      isOpen={isOpen}
      onClose={onClose}
      backgroundColor={backgroundColor}
    >
      {isOpen && <RemoveLiquidity currencyA={currencyA} currencyB={currencyB} />}
    </Drawer>
  )
}

export default RemoveLiquidityDrawer
