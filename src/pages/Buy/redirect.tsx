import getCountry from "../../utils/extractCountry";
import {
  WYRE_API_KEY,
  WYRE_ID,
  WYRE_RESERVE_API_ENDPOINT,
  WYRE_API_URL,
  WYRE_CALLBACK_URL
} from '../../constants'
import {signature} from '../../state/wyre/hooks'

export const redirectToWyre = async (data: any): Promise<boolean> => {
  const body = {
    ...data,
    referrerAccountId: WYRE_ID,
    destCurrency: "AVAX",
    redirectUrl: WYRE_CALLBACK_URL,
    hideTrackBtn: true,
    country: getCountry()
  }

  const timestamp = new Date().getTime();
  const url = `${WYRE_API_URL}${WYRE_RESERVE_API_ENDPOINT}?timestamp=${timestamp}`

  const headers = {
    'X-Api-Key': WYRE_API_KEY,
    'X-Api-Signature': signature(url, JSON.stringify(body)),
    'Content-Type': 'application/json'
  }

  try {
    const response = await fetch(url, {
      method: 'post',
      'headers': headers, body: JSON.stringify(body)
    })
    const responseBody = await response.json()
    if (response.status === 200) {
      if (responseBody.url) {
        window.open(responseBody.url, '_self')
      } else {
        console.debug("No URL returned by Sendwyre")
        return false
      }
    } else {
      console.debug("Request failed")
      return false
    }
    return true
  } catch (error) {
    console.debug('Failed to fetch quote from Sendwyre', error)
    return false
  }
}
