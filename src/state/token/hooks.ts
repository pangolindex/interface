import { blockClients } from '../../apollo/client'
import { GET_BLOCKS } from '../../apollo/block'
import { splitQuery } from 'src/utils/query'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { ChainId } from '@pangolindex/sdk'

dayjs.extend(utc)

export async function getBlocksFromTimestamps(timestamps: Array<number>, skipCount = 500, chainId: ChainId) {
  const blockClient = blockClients[chainId]
  if (timestamps?.length === 0 || !blockClient) {
    return []
  }
  const fetchedData: any = await splitQuery(GET_BLOCKS, blockClient, [], timestamps, skipCount)
  const blocks = []
  if (fetchedData) {
    for (const t in fetchedData) {
      if (fetchedData[t].length > 0) {
        blocks.push({
          timestamp: t.split('t')[1],
          number: fetchedData[t][0]['number']
        })
      }
    }
  }

  return blocks
}
