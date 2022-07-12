import React from 'react'
import Drawer from 'src/components/Drawer'
import { Token } from '@pangolindex/sdk'
import { useTranslation } from '@pangolindex/components'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import AddLiquidity from '../EarnWidget/AddLiquidity'
import { useChainId } from 'src/hooks'

type Props = {
  isOpen: boolean
  clickedLpTokens: Array<Token>
  onClose: () => void
  onAddToFarm?: () => void
  backgroundColor?: string
}

const AddLiquidityDrawer: React.FC<Props> = ({ isOpen, onClose, onAddToFarm, clickedLpTokens, backgroundColor }) => {
  const { t } = useTranslation()
  const chainId = useChainId()

  const token0 = clickedLpTokens?.[0]
  const token1 = clickedLpTokens?.[1]

  const currencyA = token0 && unwrappedToken(token0, chainId)
  const currencyB = token1 && unwrappedToken(token1, chainId)

  return (
    <Drawer title={t('pool.addLiquidity')} isOpen={isOpen} onClose={onClose} backgroundColor={backgroundColor}>
      {isOpen && (
        <AddLiquidity
          currencyA={currencyA}
          currencyB={currencyB}
          onComplete={onClose}
          onAddToFarm={onAddToFarm}
          type="card"
        />
      )}
    </Drawer>
  )
}

export default AddLiquidityDrawer
