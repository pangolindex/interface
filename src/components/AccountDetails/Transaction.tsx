import React, { useMemo } from 'react'
import styled from 'styled-components'
import { CheckCircle, Triangle } from 'react-feather'
import { getEtherscanLink } from '@honeycomb-finance/shared'
import { useAllTransactions as useAllTransactionsComponents } from '@honeycomb-finance/state-hooks'
import { useChainId } from '../../hooks'
import { ExternalLink } from '../../theme'
import { useAllTransactions } from '../../state/transactions/hooks'
import { RowFixed } from '../Row'
import Loader from '../Loader'
import { TransactionDetails } from 'src/state/transactions/reducer'

const TransactionWrapper = styled.div``

const TransactionStatusText = styled.div`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  :hover {
    text-decoration: underline;
  }
`

const TransactionState = styled(ExternalLink)<{ pending: boolean; success?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none !important;
  border-radius: 0.5rem;
  padding: 0.25rem 0rem;
  font-weight: 500;
  font-size: 0.825rem;
  color: ${({ theme }) => theme.primary};
`

const IconWrapper = styled.div<{ pending: boolean; success?: boolean }>`
  color: ${({ pending, success, theme }) => {
    if (pending) return theme.primary1
    return success ? theme.green1 : theme.red1
  }};
`

export default function Transaction({ hash }: { hash: string }) {
  const chainId = useChainId()
  const allTransactionsInterface = useAllTransactions()
  const allTransactionsComponents = useAllTransactionsComponents()

  const allTransactions: { [txHash: string]: TransactionDetails } = useMemo(() => {
    return { ...allTransactionsInterface, ...allTransactionsComponents }
  }, [allTransactionsInterface, allTransactionsComponents])

  const tx = allTransactions?.[hash]
  const summary = tx?.summary
  const pending = !tx?.receipt
  const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')

  if (!chainId) return null

  return (
    <TransactionWrapper>
      <TransactionState href={getEtherscanLink(chainId, hash, 'transaction')} pending={pending} success={success}>
        <RowFixed>
          <TransactionStatusText>{summary ?? hash} ↗</TransactionStatusText>
        </RowFixed>
        <IconWrapper pending={pending} success={success}>
          {pending ? <Loader /> : success ? <CheckCircle size="16" /> : <Triangle size="16" />}
        </IconWrapper>
      </TransactionState>
    </TransactionWrapper>
  )
}
