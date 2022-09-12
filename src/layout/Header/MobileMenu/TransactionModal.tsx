import {
  Box,
  Button,
  Text,
  useAllTransactions as useAllTransactionsComponents,
  useAllTransactionsClearer,
  useTranslation,
  getEtherscanLink
} from '@pangolindex/components'
import React, { useCallback, useContext, useMemo } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { CheckCircle, Triangle } from 'react-feather'
import Loader from 'src/components/Loader'
import { useChainId } from 'src/hooks'
import { useDispatch } from 'src/state'
import { clearAllTransactions } from 'src/state/transactions/actions'
import { isTransactionRecent, useAllTransactions } from 'src/state/transactions/hooks'
import { TransactionDetails } from 'src/state/transactions/reducer'
import { ThemeContext } from 'styled-components'
import { CloseButton, TransactionState } from './styled'

interface Props {
  onClose: () => void
}

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

const TransactionModal: React.FC<Props> = ({ onClose }) => {
  const chainId = useChainId()
  const { t } = useTranslation()

  const theme = useContext(ThemeContext)

  const allTransactionsInterface = useAllTransactions()

  const allTransactionsComponents = useAllTransactionsComponents()
  const clearAllTxComponents = useAllTransactionsClearer()

  const allTransactions: { [txHash: string]: TransactionDetails } = useMemo(() => {
    return { ...allTransactionsInterface, ...allTransactionsComponents }
  }, [allTransactionsInterface, allTransactionsComponents])

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pendingTransactions = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmedTransactions = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  const dispatch = useDispatch()

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) {
      dispatch(clearAllTransactions({ chainId }))
      clearAllTxComponents()
    }
  }, [dispatch, chainId, clearAllTxComponents])

  function renderTransactions(transactions: string[]) {
    return transactions.map((hash, index) => {
      const tx = allTransactions?.[hash]
      const summary = tx?.summary
      const pending = !tx?.receipt
      const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
      return (
        <TransactionState href={getEtherscanLink(chainId, hash, 'transaction')} key={index}>
          <Text color="primary1">{summary ?? hash} ↗</Text>
          {pending ? (
            <Loader stroke={theme.primary1} />
          ) : success ? (
            <CheckCircle size="16" color={theme.green1} />
          ) : (
            <Triangle size="16" color={theme.red1} />
          )}
        </TransactionState>
      )
    })
  }

  return (
    <Box
      width="100%"
      height="100%"
      position="relative"
      bgColor="color2"
      minWidth="70vw"
      minHeight="70vh"
      padding="20px"
    >
      <CloseButton onClick={onClose} />
      {pendingTransactions.length || confirmedTransactions.length ? (
        <Box display="flex" flexDirection="column" style={{ gap: '10px' }} height="100%">
          <Box width="100%" justifyContent="space-between" display="flex" alignItems="center">
            <Text fontSize="16px" color="text1" fontWeight={500}>
              {t('accountDetails.recentTransactions')}
            </Text>
            <Button variant="plain" onClick={clearAllTransactionsCallback} width="auto">
              <Text fontSize="16px" color="text15">
                {t('accountDetails.clearAll')}
              </Text>
            </Button>
          </Box>
          <Box height="100%" minHeight="200px" flexGrow={1}>
            <Scrollbars style={{ width: '100%', height: '100%' }}>
              {renderTransactions(pendingTransactions)}
              {renderTransactions(confirmedTransactions)}
            </Scrollbars>
          </Box>
        </Box>
      ) : (
        <Text fontSize="16px" color="text1">
          {t('accountDetails.transactionAppear')}
        </Text>
      )}
    </Box>
  )
}

export default TransactionModal
