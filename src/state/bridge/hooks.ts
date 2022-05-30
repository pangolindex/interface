import axios from 'axios'
import { useQuery } from 'react-query'
import { DIRECTUS_GRAPHQL_URL } from 'src/constants'


export interface Questions {
    id: number
    title: string
    content: string
  }
  
  export function useGetQuestions() {
    const queryData = JSON.stringify({
      query: `query getKnowledge($filter: kb_filter) {
        kb(filter: $filter) {
            id
            title
            content
        }
    }`,
      variables: { filter: { category: { _eq: 'Bridge' } } }
    })
  
    const headers = {
      'Content-Type': 'application/json'
    }
  
    return useQuery('getQuestions', async () => {
      const response = await axios.post(DIRECTUS_GRAPHQL_URL, queryData, { headers: headers })
      const questions: Questions[] = response.data?.data?.kb?.map((e: any) => {
        return {
          id: e?.id,
          title: e?.title,
          content: e?.content
        } as Questions
      })
  
      return questions
    })
  }
  