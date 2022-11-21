import React, { useContext } from 'react'
import { Box, Text, Button, useTranslation, getEtherscanLink } from '@pangolindex/components'
import { Root, Link } from './styled'
import { ArrowUpCircle } from 'react-feather'
import { useChainId } from 'src/hooks'
import { ThemeContext } from 'styled-components'

interface Props {
  onClose: () => void
  hash?: string
}

const TransactionSubmitted = ({ onClose, hash }: Props) => {
  const chainId = useChainId()
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)

  return (
    <Root>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" flex={1} paddingY={'20px'}>
        <Box flex="1" display="flex" alignItems="center">
          <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary1} />
        </Box>
        <Text fontWeight={500} fontSize={20} color="text1">
          {t('earn.transactionSubmitted')}
        </Text>
        {chainId && hash && (
          <Link
            as="a"
            fontWeight={500}
            fontSize={14}
            color={'primary1'}
            href={getEtherscanLink(chainId, hash, 'transaction')}
          >
            {t('transactionConfirmation.viewExplorer')}
          </Link>
        )}
      </Box>
      <Button variant="primary" onClick={onClose}>
        {t('transactionConfirmation.close')}
      </Button>
    </Root>
  )
}
export default TransactionSubmitted
