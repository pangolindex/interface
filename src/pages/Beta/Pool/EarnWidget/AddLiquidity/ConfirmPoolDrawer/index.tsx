import React, { useContext } from 'react'
import { AlertTriangle, ArrowUpCircle } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Currency, CurrencyAmount, Fraction, Percent, TokenAmount } from '@pangolindex/sdk'
import { CurrencyLogo, DoubleCurrencyLogo, Text, Box, Button } from '@pangolindex/components'
import { ThemeContext } from 'styled-components'
import { getEtherscanLink } from 'src/utils'
import Drawer from 'src/components/Drawer'
import { Field } from 'src/state/mint/actions'
import {
  Header,
  OutputText,
  Footer,
  Root,
  PendingWrapper,
  ErrorWrapper,
  ErrorBox,
  SubmittedWrapper,
  Link
} from './styled'
import { CustomLightSpinner } from 'src/theme'
import Circle from 'src/assets/images/blue-loader.svg'
import { useActiveWeb3React } from 'src/hooks'

interface Props {
  isOpen: boolean
  attemptingTxn: boolean
  txHash: string | undefined
  allowedSlippage: number
  liquidityMinted?: TokenAmount
  poolErrorMessage: string | undefined
  onClose: () => void
  onComplete?: () => void
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}

const ConfirmSwapDrawer: React.FC<Props> = props => {
  const {
    isOpen,
    onClose,
    allowedSlippage,
    attemptingTxn,
    liquidityMinted,
    poolErrorMessage,
    txHash,
    noLiquidity,
    price,
    currencies,
    parsedAmounts,
    poolTokenPercentage,
    onAdd,
    onComplete = () => {
      /**/
    }
  } = props

  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  const pendingText = `Supplying ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
    currencies[Field.CURRENCY_A]?.symbol
  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencies[Field.CURRENCY_B]?.symbol}`

  const ConfirmContent = (
    <Root>
      <Header>
        {noLiquidity ? (
          <Box display="flex">
            <Text fontSize="26px" fontWeight={500} lineHeight="42px" marginRight={10} color="text1">
              {currencies[Field.CURRENCY_A]?.symbol + '/' + currencies[Field.CURRENCY_B]?.symbol}
            </Text>
            <DoubleCurrencyLogo
              currency0={currencies[Field.CURRENCY_A]}
              currency1={currencies[Field.CURRENCY_B]}
              size={30}
            />
          </Box>
        ) : (
          <Box>
            <Box display="flex">
              <Text fontSize="26px" fontWeight={500} lineHeight="42px" marginRight={10} color="text1">
                {liquidityMinted?.toSignificant(6)}
              </Text>
              <DoubleCurrencyLogo
                currency0={currencies[Field.CURRENCY_A]}
                currency1={currencies[Field.CURRENCY_B]}
                size={30}
              />
            </Box>

            <Box>
              <Text fontSize="20px" color="text1" lineHeight="40px">
                {currencies[Field.CURRENCY_A]?.symbol +
                  '/' +
                  currencies[Field.CURRENCY_B]?.symbol +
                  t('addLiquidity.poolTokens')}
              </Text>
            </Box>
            <OutputText>{t('addLiquidity.outputEstimated', { allowedSlippage: allowedSlippage / 100 })}</OutputText>
          </Box>
        )}
        <Box mt={20}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Text fontSize="12px" color="text1">
              {currencies[Field.CURRENCY_A]?.symbol} {t('addLiquidity.deposited')}
            </Text>
            <Box display="flex">
              <CurrencyLogo currency={currencies[Field.CURRENCY_A]} size="16px" />
              <Text fontSize="14px" color="text1" ml="10px">
                {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
              </Text>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt="5px">
            <Text fontSize="12px" color="text1">
              {currencies[Field.CURRENCY_B]?.symbol} {t('addLiquidity.deposited')}
            </Text>
            <Box display="flex">
              <CurrencyLogo currency={currencies[Field.CURRENCY_B]} size="16px" />
              <Text fontSize="14px" color="text1" ml="10px">
                {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
              </Text>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt="5px">
            <Text fontSize="12px" color="text1">
              {t('addLiquidity.rates')}
            </Text>
            <Box>
              <Text fontSize="14px" color="text1" ml="10px">
                {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
                  currencies[Field.CURRENCY_B]?.symbol
                }`}
              </Text>

              <Text fontSize="14px" color="text1" ml="10px">
                {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
                  currencies[Field.CURRENCY_A]?.symbol
                }`}
              </Text>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt="5px">
            <Text fontSize="12px" color="text1">
              {t('addLiquidity.shareOfPool')}
            </Text>

            <Text fontSize="14px" color="text1" ml="10px">
              {noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%
            </Text>
          </Box>
        </Box>
      </Header>
      <Footer>
        <Box my={'10px'}>
          <Button variant="primary" onClick={onAdd}>
            {noLiquidity ? t('addLiquidity.createPoolSupply') : t('addLiquidity.confirmSupply')}
          </Button>
        </Box>
      </Footer>
    </Root>
  )

  const PendingContent = (
    <PendingWrapper>
      <Box mb={'15px'}>
        <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
      </Box>
      <Text fontWeight={500} fontSize={20} color="text1" textAlign="center">
        {t('transactionConfirmation.waitingConfirmation')}
      </Text>
      <Text fontWeight={600} fontSize={14} color="text1" textAlign="center">
        {pendingText}
      </Text>
      <Text fontSize={12} color="text1" textAlign="center">
        {t('transactionConfirmation.confirmTransaction')}
      </Text>
    </PendingWrapper>
  )

  const ErroContent = (
    <ErrorWrapper>
      <ErrorBox>
        <AlertTriangle color={theme.red1} style={{ strokeWidth: 1.5 }} size={64} />
        <Text fontWeight={500} fontSize={16} color={'red1'} style={{ textAlign: 'center', width: '85%' }}>
          {poolErrorMessage}
        </Text>
      </ErrorBox>
      <Button variant="primary" onClick={onClose}>
        {t('transactionConfirmation.dismiss')}
      </Button>
    </ErrorWrapper>
  )

  const SubmittedContent = (
    <SubmittedWrapper>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" paddingY={'20px'}>
        <Box flex="1" display="flex" alignItems="center">
          <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary} />
        </Box>
        <Text fontWeight={500} fontSize={20} color="text1">
          {t('transactionConfirmation.transactionSubmitted')}
        </Text>
        {chainId && txHash && (
          <Link
            as="a"
            fontWeight={500}
            fontSize={14}
            color={'primary'}
            href={getEtherscanLink(chainId, txHash, 'transaction')}
          >
            {t('transactionConfirmation.viewExplorer')}
          </Link>
        )}
      </Box>
      <Button
        variant="primary"
        onClick={() => {
          onClose()
          onComplete()
        }}
      >
        {t('transactionConfirmation.close')}
      </Button>
    </SubmittedWrapper>
  )

  return (
    <Drawer
      title={noLiquidity ? t('addLiquidity.creatingPool') : t('addLiquidity.willReceive')}
      isOpen={isOpen}
      onClose={onClose}
    >
      {poolErrorMessage ? ErroContent : txHash ? SubmittedContent : attemptingTxn ? PendingContent : ConfirmContent}
    </Drawer>
  )
}
export default ConfirmSwapDrawer
