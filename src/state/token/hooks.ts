import { useEffect } from 'react'
import { client } from '../../apollo/client'
import { GET_TOKEN_DAY_DATAS } from '../../apollo/tokenDayDatas'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { updateChartData } from 'src/state/token/actions'

export function useAllTokenChartData(): { [address: string]: Array<{ priceUSD: number; date: string }> } | undefined {
  const allTokenCharts = useSelector<AppState, AppState['token']['weekly']>(state => state?.token?.weekly || {})

  return allTokenCharts
}

export function useTokenChartData(tokenAddress: string) {
  const data1 = useAllTokenChartData()

  const chartData = data1?.[tokenAddress]

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    async function checkForChartData() {
      if (!chartData) {
        let data = await getTokenChartData(tokenAddress)

        dispatch(updateChartData({ address: tokenAddress, chartData: data }))
      }
    }
    checkForChartData()
  }, [chartData, tokenAddress, updateChartData])
  return chartData
}

const getTokenChartData = async (tokenAddress: string) => {
  let data = []

  try {
    const result = await client.query({
      query: GET_TOKEN_DAY_DATAS,
      variables: {
        token: tokenAddress
      },
      fetchPolicy: 'cache-first'
    })

    data = result?.data?.tokenDayDatas
  } catch (e) {
    console.log(e)
  }
  data = data.sort((a : any, b:any) => (parseInt(a.date) > parseInt(b.date) ? 1 : -1))
  return data
}
