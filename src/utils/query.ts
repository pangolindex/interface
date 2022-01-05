export async function splitQuery(query: any, localClient: any, vars: any, list: Array<any>, skipCount = 100) {
  let fetchedData = {}
  let allFound = false
  let skip = 0

  while (!allFound) {
    let end = list.length
    if (skip + skipCount < list.length) {
      end = skip + skipCount
    }
    let sliced = list.slice(skip, end)
    let result = await localClient.query({
      query: query(...vars, sliced),
      fetchPolicy: 'cache-first'
    })
    fetchedData = {
      ...fetchedData,
      ...result.data
    }
    if (Object.keys(result.data).length < skipCount || skip + skipCount > list.length) {
      allFound = true
    } else {
      skip += skipCount
    }
  }

  return fetchedData
}

export async function crawlSingleQuery(
  query: any,
  queryField: any,
  localClient: any,
  localClientOptions: any,
  vars: any,
  pointer: any,
  pointerField = 'timestamp',
  crawlingForward = true,
  limit = 1000
) {
  let allResults = [] as any
  let allFound = false

  while (!allFound) {
    let result = await localClient.query({
      query: query,
      variables: {
        ...vars,
        pointer
      },
      ...localClientOptions
    })

    allResults = crawlingForward
      ? allResults.concat(result.data[queryField])
      : result.data[queryField].concat(allResults)

    if (result.data[queryField].length < limit) {
      allFound = true
    } else {
      const newIndex = crawlingForward ? result.data[queryField].length - 1 : 0
      pointer = result.data[queryField][newIndex][pointerField]
    }
  }

  return allResults
}
