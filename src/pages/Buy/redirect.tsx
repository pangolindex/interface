import getCountry from "../../utils/extractCountry";
import {
  WYRE_API_KEY,
  WYRE_ID,
  WYRE_RESERVE_API_ENDPOINT,
  WYRE_SECRET_KEY,
  WYRE_API_URL
} from '../../constants'
import CryptoJS from 'crypto-js'

export const redirectToWyre = async (data: any): Promise<boolean> => {
  const body = {
    ...data,
    referrerAccountId: WYRE_ID,
    destCurrency: "AVAX",
    hideTrackBtn: true,
    country: getCountry()
  }
  console.log(body)
  // Signature Calculation using Crypto-js
  const signature = (url: string, data:string) => {
    const dataToSign = url + data;
    // @ts-ignore
    const token = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(dataToSign.toString(CryptoJS.enc.Utf8), WYRE_SECRET_KEY));
    return token;
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
