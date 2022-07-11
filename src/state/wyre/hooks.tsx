import getCountry from '../../utils/extractCountry'
import { useCallback } from 'react'
import { useDispatch } from 'src/state'
import { AppState, useSelector } from '../../state'
import { updateQuote } from './actions'
import { WYRE_API_KEY, WYRE_ID, WYRE_API_URL, WYRE_QUOTE_API_ENDPOINT, WYRE_SECRET_KEY } from '../../constants'
import CryptoJS from 'crypto-js'

// Signature Calculation using Crypto-js
export const signature = (url: string, data: string) => {
  const dataToSign = url + data
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(dataToSign.toString(CryptoJS.enc.Utf8), WYRE_SECRET_KEY))
}

export function useQuoteRequest(account: string | null | undefined, amount: string, sourceCurrency: string): void {
  const dispatch = useDispatch()

  const getQuote = useCallback(async () => {
    if (!account || Number(amount) <= 0 || !Number(amount)) {
      dispatch(updateQuote({ quote: false }))
    } else {
      const data = {
        amount: amount,
        sourceCurrency: sourceCurrency,
        destCurrency: 'AVAX',
        dest: 'avalanche:' + account.toLowerCase(),
        accountId: WYRE_ID,
        country: getCountry()
      }

      const timestamp = new Date().getTime()
      const url = `${WYRE_API_URL}${WYRE_QUOTE_API_ENDPOINT}?timestamp=${timestamp}`

      const headers = {
        'X-Api-Key': WYRE_API_KEY,
        'X-Api-Signature': signature(url, JSON.stringify(data)),
        'Content-Type': 'application/json'
      }

      try {
        const response = await fetch(url, {
          method: 'post',
          headers: headers,
          body: JSON.stringify(data)
        })
        const quote = await response.json()
        if (response.status === 200) {
          dispatch(updateQuote({ quote: quote }))
        } else {
          dispatch(updateQuote({ quote: false }))
        }
      } catch (error) {
        console.debug('Failed to fetch quote from Wyre', error)
        dispatch(updateQuote({ quote: false }))
      }
    }
  }, [dispatch, amount, account, sourceCurrency])

  getQuote()
}

export function useGetQuote() {
  return {
    quote: useSelector<AppState['wyre']['quote']>(state => state.wyre.quote)
  }
}
