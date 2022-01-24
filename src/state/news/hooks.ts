import { useEffect, useState } from "react"
import qs from 'qs'

enum TypeNews {
    news = 1,
    tutorial = 2,
    other = 3
}

export interface News {
    id: number
    title: string
    content: number
    createdAt: Date
    updatedAt: Date
    publishedAt: Date
    type: TypeNews
}


// Get News in Pangolin Strapi api
export function useGetNews() {
    const [news, setNews] = useState<News[]>()

    const query = qs.stringify({
        filters: {
            Type: {
                $eq: "news"
            }
        },
        sort: ["publishedAt:desc"],
        pagination: {
            page: 1,
            pageSize: 10,
        },
    }, {
        encodeValuesOnly: true,
    })

    useEffect(() => {
        const getNews = async () => {
            const response = await fetch(`https://cms.api.pango.elasticboard.io/api/articles?${query}`)
            const data = await response.json()
            const requestNews: News[] = data?.data?.map((element: any) => {
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
            setNews(requestNews)
        }

        getNews()

    }, [query, setNews])

    return news
}