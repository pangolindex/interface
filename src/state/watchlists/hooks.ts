import { useSelector } from 'react-redux'
import { AppState } from '../index'
import { Token } from '@pangolindex/sdk'

export function useSelectedCurrencyLists(): Token[] | undefined {
  return useSelector<AppState, AppState['watchlists']['currencies']>(state =>
    ([] as Token[]).concat(state?.watchlists?.currencies || [])
  )
}

export function useIsSelectedCurrency(currency: Token): Boolean {
  const currencies = useSelectedCurrencyLists()
  const isSelected = (currencies || []).includes(currency)
  return isSelected
}
