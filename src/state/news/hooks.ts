import axios from 'axios'
import qs from 'qs'
import { useQuery } from 'react-query'

enum TypeNews {
  news = 1,
  tutorial = 2,
  other = 3
}

export interface News {
  id: number
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  publishedAt: Date
  type: TypeNews
}

// Get News in Pangolin Strapi api
export function useGetNews() {
  const query = qs.stringify(
    {
      filters: {
        Type: {
          $eq: 'news'
        }
      },
      sort: ['publishedAt:desc'],
      pagination: {
        page: 1,
        pageSize: 10
      }
    },
    {
      encodeValuesOnly: true
    }
  )

  return useQuery('getNews', async () => {
    const response = await axios.get(`https://cms.api.pango.elasticboard.io/api/articles?${query}`, {
      timeout: 1000
    })
    const data = response.data
    const news: News[] = data?.data?.map((element: any) => {
      return {
        id: element?.id,
        title: element?.attributes?.title,
        content: element?.attributes?.content,
        createdAt: new Date(element?.attributes?.createdAt),
        updatedAt: new Date(element?.attributes?.updatedAt),
        publishedAt: new Date(element?.attributes?.publishedAt),
        type: TypeNews[element?.attributes?.Type]
      }
    })

    return news
  })
}
