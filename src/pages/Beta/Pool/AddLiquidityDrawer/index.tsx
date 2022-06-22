import React from 'react'
import Drawer from 'src/components/Drawer'
import { Token } from '@pangolindex/sdk'
import { useTranslation } from 'react-i18next'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import AddLiquidity from '../EarnWidget/AddLiquidity'
import { useChainId } from 'src/hooks'

type Props = {
  isOpen: boolean
  clickedLpTokens: Array<Token>
  onClose: () => void
  redirect?: () => void
  backgroundColor?: string
}

const AddLiquidityDrawer: React.FC<Props> = ({ isOpen, onClose, redirect, clickedLpTokens, backgroundColor }) => {
  const { t } = useTranslation()
  const chainId = useChainId()

  const token0 = clickedLpTokens?.[0]
  const token1 = clickedLpTokens?.[1]

  const currencyA = token0 && unwrappedToken(token0, chainId)
  const currencyB = token1 && unwrappedToken(token1, chainId)

  return (
    <Drawer title={t('pool.addLiquidity')} isOpen={isOpen} onClose={onClose} backgroundColor={backgroundColor}>
      {isOpen && (
        <AddLiquidity currencyA={currencyA} currencyB={currencyB} onComplete={redirect ?? onClose} type="card" />
      )}
    </Drawer>
  )
}

export default AddLiquidityDrawer
