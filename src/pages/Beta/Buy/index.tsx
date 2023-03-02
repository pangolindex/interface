import React from 'react'
import { useParams } from 'react-router-dom'
import { BUY_MENU_LINK } from 'src/constants'
import CoinbasePay from './CoinbasePay'
import Moonpay from './Moonpay'
import C14 from './C14'

export interface BuyProps {
  type: string
}

export default function BuyV2() {
  const params = useParams<BuyProps>()

  if (params?.type === BUY_MENU_LINK.coinbasePay) {
    return <CoinbasePay />
  }

  if (params?.type === BUY_MENU_LINK.c14) {
    return <C14 />
  }

  return <Moonpay />
}
