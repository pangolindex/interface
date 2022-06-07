import axios from 'axios'
import { useQuery } from 'react-query'
import { DIRECTUS_GRAPHQL_URL } from 'src/constants'

export interface SubCategories {
  id: number
  title: string
  content: string
  subcategory: string
}

export function useSubBridgeCategories(filter: string, subCategory: string) {
  const queryData = subCategory !== 'undefined' ? JSON.stringify({
    query: `query getKnowledge($filter: kb_filter) {
      kb(filter: $filter) {
          id
          title
          content
          subcategory
      }
  }`,
    variables: { filter: { _and: [{ category: { _eq: filter } }, { subcategory: { _eq: subCategory } }] } }
  }) : JSON.stringify({
    query: `query getKnowledge($filter: kb_filter) {
      kb(filter: $filter) {
          id
          title
          content
          subcategory
      }
  }`,
    variables: { filter: { category: { _eq: filter } } }
  })

  const headers = {
    'Content-Type': 'application/json'
  }
    return useQuery(subCategory, async () => {
      const response = await axios.post(DIRECTUS_GRAPHQL_URL, queryData, { headers: headers })
      const categories: SubCategories[] = response.data?.data?.kb?.map((e: any) => {
        return {
          id: e?.id,
          title: e?.title,
          content: e?.content,
          subcategory: e?.subcategory
        } as SubCategories
      })
      return categories
    })
}
