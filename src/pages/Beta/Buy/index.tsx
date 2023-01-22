import React from 'react'
import { useParams } from 'react-router-dom'
import { BUY_MENU_LINK } from 'src/constants'
import CoinbasePay from './CoinbasePay'
import Moonpay from './Moonpay'
export interface BuyProps {
  type: string
}

export default function BuyV2() {
  const params = useParams<BuyProps>()

  if (params?.type === BUY_MENU_LINK.coinbasePay) {
    return <CoinbasePay />
  }

  return <Moonpay />
}
