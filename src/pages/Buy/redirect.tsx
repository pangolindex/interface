import getCountry from "../../utils/extractCountry";
import {WYRE_API_KEY, WYRE_ID, WYRE_API_URL, WYRE_RESERVE_API_ENDPOINT} from '../../constants'

export const redirectToWyre = async (data: any): Promise<boolean> => {
  const body = {
    ...data,
    referrerAccountId: WYRE_ID,
    destCurrency: "ETH",
    hideTrackBtn: true,
    country: getCountry()
  }

  const headers = {
    'Authorization': WYRE_API_KEY,
    'Content-Type': 'application/json'
  }
  const url = `${WYRE_API_URL}${WYRE_RESERVE_API_ENDPOINT}`
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
