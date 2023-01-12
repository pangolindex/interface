import React, { useEffect, useState } from 'react'
import { initOnRamp } from '@coinbase/cbpay-js'
import { COINBASE_PK } from 'src/constants'
import { useActiveWeb3React } from 'src/hooks'

export default function CoinbasePay() {
  const [init, setInit] = useState(false)
  const { account } = useActiveWeb3React()

  useEffect(() => {
    if (init) return
    if (!account) return
    setInit(true)

    initOnRamp(
      {
        appId: COINBASE_PK,
        widgetParameters: {
          destinationWallets: [
            {
              address: account,
              blockchains: ['avalanche-c-chain']
            }
          ]
        },
        experienceLoggedIn: 'embedded',
        experienceLoggedOut: 'popup'
      },
      (err, instance) => {
        if (err) {
          console.error(err)
        } else if (instance) {
          instance.open()
        }
      }
    )
  }, [account, init])

  return <div />
}
