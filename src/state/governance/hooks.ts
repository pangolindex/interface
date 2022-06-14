import { PNG } from 'src/constants/tokens'
import { TokenAmount, JSBI } from '@pangolindex/sdk'
import { isAddress } from 'ethers/lib/utils'
import { useGovernanceContract, usePngContract } from 'src/hooks/useContract'
import { useSingleCallResult, useSingleContractMultipleData } from '../multicall/hooks'
import { useActiveWeb3React } from 'src/hooks'
import { ethers, utils } from 'ethers'
import { calculateGasMargin } from 'src/utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../transactions/hooks'
import { useState, useEffect, useCallback } from 'react'
import GOV from '@pangolindex/governance/artifacts/contracts/GovernorAlpha.sol/GovernorAlpha.json'
import { GET_BLOCK } from 'src/apollo/block'
import { blockClient, governanceClient } from 'src/apollo/client'
import { GET_PROPOSALS } from 'src/apollo/vote'
import { useLibrary } from '@pangolindex/components'

interface ProposalDetail {
  target: string
  functionSig: string
  callData: string
}

export interface ProposalData {
  id: string
  title: string
  description: string
  proposer: string
  status: string
  forCount: number
  againstCount: number
  startTime: number
  endTime: number
  startBlock?: number
  details: ProposalDetail[]
  canceled?: boolean
  executed?: boolean
  eta?: number
}

export enum ProposalState {
  pending = 'pending',
  active = 'active',
  canceled = 'canceled',
  defeated = 'defeated',
  succeeded = 'succeeded',
  queued = 'queued',
  expired = 'expired',
  executed = 'executed'
}

const enumerateProposalState = (state: number) => {
  const proposalStates = ['pending', 'active', 'canceled', 'defeated', 'succeeded', 'queued', 'expired', 'executed']
  return proposalStates[state]
}

const getProposalState = (proposal: ProposalData) => {
  const currentTimestamp = () => Math.floor(Date.now() / 1000)

  if (proposal.canceled) {
    return ProposalState.canceled
  } else if (currentTimestamp() <= proposal.startTime) {
    return ProposalState.pending
  } else if (currentTimestamp() <= proposal.endTime) {
    return ProposalState.active
  } else if (
    proposal.againstCount &&
    JSBI.lessThanOrEqual(JSBI.BigInt(proposal.forCount), JSBI.BigInt(proposal?.againstCount || 0))
  ) {
    return ProposalState.defeated
  } else if (proposal.eta === 0) {
    return ProposalState.succeeded
  } else if (proposal.executed) {
    return ProposalState.executed
    // } else if (block.timestamp >= add256(proposal.eta, timelock.GRACE_PERIOD())) {
    //     return ProposalState.expired;
  } else {
    return ProposalState.queued
  }
}

// get count of all proposals made
export function useProposalCount(): number | undefined {
  const gov = useGovernanceContract()
  const res = useSingleCallResult(gov, 'proposalCount')
  if (res.result && !res.loading) {
    return parseInt(res.result[0]) ?? 0
  }
  return undefined
}

/**
 * @notice Fetches first block after a given timestamp
 * @dev Query speed is optimized by limiting to a 600-second period
 * @param {Number} timestamp in seconds
 */
export async function getBlockFromTimestamp(timestamp: number) {
  const result = await blockClient.query({
    query: GET_BLOCK,
    variables: {
      timestampFrom: timestamp,
      timestampTo: timestamp + 60 * 60 * 24 * 7
    },
    fetchPolicy: 'cache-first'
  })
  return result?.data?.blocks?.[0]?.number
}

/**
 * Need proposal events to get description data emitted from
 * new proposal event.
 */
export function useDataFromEventLogs() {
  // const { library } = useActiveWeb3React()
  const { library } = useLibrary()
  const [formattedEvents, setFormattedEvents] = useState<any>()
  const govContract = useGovernanceContract()

  const proposalCount = useProposalCount()

  const proposalIndexes = []
  for (let i = 1; i <= (proposalCount ?? 0); i++) {
    proposalIndexes.push([i])
  }

  const allProposals = useSingleContractMultipleData(govContract, 'proposals', proposalIndexes)

  useEffect(() => {
    const voteDelay: number = 60 * 60 * 24
    const eventParser = new ethers.utils.Interface(GOV.abi)

    async function fetchData() {
      let pastEvents = [] as any[]

      for (const proposal of allProposals) {
        const startTime: number = parseInt(proposal?.result?.startTime?.toString())
        if (startTime) {
          const eventTime: number = startTime - voteDelay
          const block: number = parseInt(await getBlockFromTimestamp(eventTime)) // Actual returns the "next" block
          const filter = {
            ...govContract?.filters?.['ProposalCreated'](),
            fromBlock: block - 10,
            toBlock: block + 10
          }
          pastEvents = pastEvents.concat(await library?.getLogs(filter))
        }
      }

      const formattedEventData = pastEvents
        ?.map(event => eventParser.parseLog(event).args)
        ?.map(eventParsed => ({
          description: eventParsed.description,
          details: eventParsed.targets.map((target: string, i: number) => {
            const signature = eventParsed.signatures[i]
            const [name, types] = signature.substr(0, signature.length - 1).split('(')

            const calldata = eventParsed.calldatas[i]
            const decoded = utils.defaultAbiCoder.decode(types.split(','), calldata)

            return {
              target,
              functionSig: name,
              callData: decoded.join(', ')
            }
          })
        }))
        .reverse() // reverse events to get them from newest to oldest

      setFormattedEvents(formattedEventData)
    }

    if (
      library &&
      govContract &&
      proposalCount !== undefined &&
      allProposals &&
      allProposals.length === proposalCount &&
      allProposals.every(proposal => !proposal.loading) &&
      !formattedEvents
    ) {
      fetchData()
    }
  }, [library, govContract, proposalCount, allProposals, formattedEvents])

  return formattedEvents
}

const getAllProposalData = async (id?: string) => {
  let data = [] as Array<any>

  try {
    const queryData: any = {
      query: GET_PROPOSALS,
      fetchPolicy: 'cache-first'
    }

    if (!!id) {
      queryData['variables'] = { where: { id: id } }
    }
    const result = await governanceClient.query(queryData)
    data = result?.data?.proposals
  } catch (e) {
    console.log(e)
  }

  return data
}

// get data for all past and active proposals
export function useAllProposalData() {
  const proposalCount = useProposalCount()
  const govContract = useGovernanceContract()

  const proposalIndexes = []
  for (let i = 1; i <= (proposalCount ?? 0); i++) {
    proposalIndexes.push([i])
  }

  // get metadata from past events
  const formattedEvents = useDataFromEventLogs()

  // get all proposal entities
  const allProposals = useSingleContractMultipleData(govContract, 'proposals', proposalIndexes)
  // get all proposal states
  const allProposalStates = useSingleContractMultipleData(govContract, 'state', proposalIndexes)

  if (formattedEvents && allProposals && allProposalStates) {
    allProposals.reverse()
    allProposalStates.reverse()

    return allProposals
      .filter((p, i) => {
        return Boolean(p.result) && Boolean(allProposalStates[i]?.result) && Boolean(formattedEvents[i])
      })
      .map((_p, i) => {
        const description = formattedEvents[i].description

        const formattedProposal: ProposalData = {
          id: allProposals[i]?.result?.id.toString(),
          title: description?.split(/# |\n/g)[1] || 'Untitled',
          description: description || 'No description.',
          proposer: allProposals[i]?.result?.proposer,
          status: enumerateProposalState(allProposalStates[i]?.result?.[0]) ?? 'Undetermined',
          forCount: parseFloat(ethers.utils.formatUnits(allProposals[i]?.result?.forVotes.toString(), 18)),
          againstCount: parseFloat(ethers.utils.formatUnits(allProposals[i]?.result?.againstVotes.toString(), 18)),
          startTime: parseInt(allProposals[i]?.result?.startTime?.toString()),
          endTime: parseInt(allProposals[i]?.result?.endTime?.toString()),
          startBlock: parseInt(allProposals[i]?.result?.startBlock?.toString()),
          details: formattedEvents[i].details
        }
        return formattedProposal
      })
  } else {
    return []
  }
}

// get data for all past and active proposals
export function useGetProposalsViaSubgraph(id?: string) {
  const [allProposalsData, setAllProposalsData] = useState<Array<ProposalData>>([])

  useEffect(() => {
    async function checkForChartData() {
      const allProposals = await getAllProposalData(id)

      if (allProposals) {
        const allData = allProposals.map(proposal => {
          const details = (proposal?.targets || []).map((target: string, i: number) => {
            const signature = proposal?.signatures[i]

            const [name, types] = signature?.substr(0, signature?.length - 1).split('(')

            const calldata = proposal?.calldatas[i]

            const decoded = utils.defaultAbiCoder.decode(types.split(','), calldata)

            return {
              target,
              functionSig: name,
              callData: decoded.join(', ')
            }
          })

          return {
            id: proposal?.id.toString(),
            title: proposal?.description?.split(/# |\n/g)[1] || 'Untitled',
            description: proposal?.description || 'No description.',
            proposer: proposal?.proposer,
            status:
              getProposalState({ ...proposal, forCount: proposal?.forVotes, againstCount: proposal?.againstVotes }) ??
              'Undetermined',
            forCount: proposal?.forVotes ? parseFloat(ethers.utils.formatUnits(proposal?.forVotes.toString(), 18)) : 0,
            againstCount: proposal?.againstVotes
              ? parseFloat(ethers.utils.formatUnits(proposal?.againstVotes.toString(), 18))
              : 0,
            startTime: parseInt(proposal?.startTime?.toString()),
            endTime: parseInt(proposal?.endTime?.toString()),
            details: details
          }
        })

        setAllProposalsData(allData)
      }
    }
    checkForChartData()
  }, [id])

  return allProposalsData
}

export function useProposalData(id: string): ProposalData | undefined {
  const allProposalData = useAllProposalData()
  return allProposalData?.find(p => p.id === id)
}

export function useGetProposalDetail(id: string): ProposalData | undefined {
  const allProposalData = useGetProposalsViaSubgraph(id)
  return allProposalData?.find((p: ProposalData) => p.id === id)
}

// get the users delegatee if it exists
export function useUserDelegatee(): string {
  const { account } = useActiveWeb3React()
  const uniContract = usePngContract()
  const { result } = useSingleCallResult(uniContract, 'delegates', [account ?? undefined])
  return result?.[0] ?? undefined
}

export function useUserVotes(): TokenAmount | undefined {
  const { account, chainId } = useActiveWeb3React()
  const pngContract = usePngContract()

  // check for available votes
  const png = chainId ? PNG[chainId] : undefined
  const votes = useSingleCallResult(pngContract, 'getCurrentVotes', [account ?? undefined])?.result?.[0]
  return votes && png ? new TokenAmount(png, votes) : undefined
}

export function useDelegateCallback(): (delegatee: string | undefined) => undefined | Promise<string> {
  const { account, chainId } = useActiveWeb3React()
  const { library } = useLibrary()
  const addTransaction = useTransactionAdder()

  const uniContract = usePngContract()

  return useCallback(
    (delegatee: string | undefined) => {
      if (!library || !chainId || !account || !isAddress(delegatee ?? '')) return undefined
      const args = [delegatee]
      if (!uniContract) throw new Error('No UNI Contract!')
      return uniContract.estimateGas.delegate(...args, {}).then((estimatedGasLimit: any) => {
        return uniContract
          .delegate(...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: `Delegated votes`
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, chainId, library, uniContract]
  )
}

export function useVoteCallback(): {
  voteCallback: (proposalId: string | undefined, support: boolean) => undefined | Promise<string>
} {
  const { account } = useActiveWeb3React()

  const govContract = useGovernanceContract()
  const addTransaction = useTransactionAdder()

  const voteCallback = useCallback(
    (proposalId: string | undefined, support: boolean) => {
      if (!account || !govContract || !proposalId) return
      const args = [proposalId, support]
      return govContract.estimateGas.castVote(...args, {}).then((estimatedGasLimit: any) => {
        return govContract
          .castVote(...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: `Voted ${support ? 'for ' : 'against'} proposal ${proposalId}`
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, govContract]
  )
  return { voteCallback }
}
