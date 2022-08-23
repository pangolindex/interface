import { ParsedQs, parse } from 'qs'
import { useMemo } from 'react'

export default function useParsedQueryString(): ParsedQs {
  const { href } = window.location || {}

  const search = href?.substring(href?.indexOf('?') + 1)

  return useMemo(
    () => (search && search.length > 1 ? parse(search, { parseArrays: false, ignoreQueryPrefix: true }) : {}),
    [search]
  )
}
