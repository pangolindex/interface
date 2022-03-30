import axios from 'axios'
import qs from 'qs'
import { useQuery } from 'react-query'

export interface News {
  id: number
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

// Get News in Pangolin Strapi api
export function useGetNews() {
  const query = qs.stringify(
    {
      sort: ['-date_created'],
      limit: 10
    },
    {
      encodeValuesOnly: true
    }
  )

  return useQuery('getNews', async () => {
    const response = await axios.get(`https://p7gm7mqi.directus.app/items/news?${query}`, {
      timeout: 1000
    })
    const data = response.data
    const news: News[] = data?.data?.map((element: any) => {
      return {
        id: element?.id,
        title: element?.title,
        content: element?.content,
        createdAt: new Date(element?.date_created),
        updatedAt: new Date(element?.date_updated),
      }
    })

    return news
  })
}
