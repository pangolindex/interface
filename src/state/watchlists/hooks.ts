import { useSelector } from 'react-redux'
import { ChainId, Token } from '@pangolindex/sdk'
import { AppState } from '../index'
import { COIN_LISTS } from 'src/constants/coinLists'
import { useActiveWeb3React } from 'src/hooks'

export function useSelectedCurrencyLists(): Token[] | undefined {
  const { chainId = ChainId.AVALANCHE } = useActiveWeb3React()
  const coins = COIN_LISTS.map(coin => coin[chainId]).filter(coin => !!coin)

  const addresses = useSelector<AppState, AppState['watchlists']['currencies']>(state =>
    ([] as string[]).concat(state?.watchlists?.currencies || [])
  )

  let allSelectedToken = [] as Token[]

  addresses.forEach(address => {
    const filterTokens = coins.filter(coin => address === coin.address)

    allSelectedToken = [...allSelectedToken, ...filterTokens]
  })

  return allSelectedToken
}

export function useIsSelectedCurrency(address: string): Boolean {
  const addresses = useSelector<AppState, AppState['watchlists']['currencies']>(state =>
    ([] as string[]).concat(state?.watchlists?.currencies || [])
  )
  const isSelected = (addresses || []).includes(address)
  return isSelected
}
