import getCountry from "../../utils/extractCountry";
import {useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {AppDispatch, AppState} from '../../state'
import {updateQuote} from './actions'
import {WYRE_API_KEY, WYRE_ID, WYRE_API_URL, WYRE_QUOTE_API_ENDPOINT} from '../../constants'

export function useQuoteRequest(account: string | null | undefined, amount: string, sourceCurrency: string): void {

  const dispatch = useDispatch<AppDispatch>()

  const getQuote = useCallback(async () => {

    if (!account || Number(amount) <= 0 || !Number(amount)) {
      dispatch(updateQuote({quote: false}))
    } else {

      // @ts-ignore
      const data = {
        'amount': amount,
        'sourceCurrency': sourceCurrency,
        'destCurrency': 'ETH',
        'dest': 'ethereum:' + account,
        'accountId': WYRE_ID,
        'country': getCountry()
      }

      const headers = {
        'Authorization': WYRE_API_KEY,
        'Content-Type': 'application/json'
      }
      const url = `${WYRE_API_URL}${WYRE_QUOTE_API_ENDPOINT}`
      try {
        const response = await fetch(url, {
          method: 'post',
          'headers': headers, body: JSON.stringify(data)
        })
        const quote = await response.json()
        if (response.status === 200) {
          dispatch(updateQuote({quote: quote}))
        } else {
          dispatch(updateQuote({quote: false}))
        }
      } catch (error) {
        console.debug('Failed to fetch quote from Sendwyre', error)
        dispatch(updateQuote({quote: false}))
      }
    }

  }, [dispatch, amount, account, sourceCurrency])

  getQuote()

}


export function useGetQuote() {
  return {
    quote: useSelector<AppState, AppState['wyre']['quote']>(state => state.wyre.quote)
  }
}