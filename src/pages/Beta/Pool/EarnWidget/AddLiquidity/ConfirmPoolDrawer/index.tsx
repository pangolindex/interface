import React, { useContext } from 'react'
import { AlertTriangle } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Currency, CurrencyAmount, Fraction, Percent, TokenAmount } from '@pangolindex/sdk'
import { CurrencyLogo, DoubleCurrencyLogo, Text, Box, Button } from '@pangolindex/components'
import { ThemeContext } from 'styled-components'
import Drawer from 'src/components/Drawer'
import { Field } from 'src/state/mint/actions'
import { Header, OutputText, Footer, Root, ErrorWrapper, ErrorBox, StatWrapper } from './styled'
import TransactionCompleted from 'src/components/Beta/TransactionCompleted'
import Loader from 'src/components/Beta/Loader'
import Stat from 'src/components/Stat'

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
  type: 'card' | 'detail'
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
    },
    type
  } = props

  // const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  const pendingText = `Supplying ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
    currencies[Field.CURRENCY_A]?.symbol
  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencies[Field.CURRENCY_B]?.symbol}`

  const DetailConfirmContent = (
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

  const CardConfirmContent = (
    <Box display="flex" flexDirection="column" p={10} height="100%">
      <Box flex={1}>
        <StatWrapper>
          <Box display="inline-block">
            <Text color={'text1'} fontSize={16}>
              {t('addLiquidity.deposited')}
            </Text>

            <Box display="flex" alignItems="center">
              <Text color={'text1'} fontSize={20}>
                {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
              </Text>

              <Box ml={10} mt="8px">
                <CurrencyLogo currency={currencies[Field.CURRENCY_A]} size="20px" />
              </Box>
            </Box>

            <Box display="flex" alignItems="center">
              <Text color={'text1'} fontSize={20}>
                {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
              </Text>

              <Box ml={10} mt="8px">
                <CurrencyLogo currency={currencies[Field.CURRENCY_B]} size="20px" />
              </Box>
            </Box>
          </Box>

          <Stat
            title={`PGL`}
            stat={noLiquidity ? '-' : `     ${liquidityMinted?.toSignificant(6)}`}
            titlePosition="top"
            titleFontSize={16}
            statFontSize={20}
          />

          <Stat
            title={t('addLiquidity.shareOfPool')}
            stat={`${noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%`}
            titlePosition="top"
            titleFontSize={14}
            statFontSize={16}
          />
        </StatWrapper>

        <OutputText>{t('addLiquidity.outputEstimated', { allowedSlippage: allowedSlippage / 100 })}</OutputText>
      </Box>
      <Box mt={'10px'}>
        <Button variant="primary" onClick={onAdd} height="46px">
          {noLiquidity ? t('addLiquidity.createPoolSupply') : t('addLiquidity.confirmSupply')}
        </Button>
      </Box>
    </Box>
  )

  const PendingContent = <Loader size={100} label={pendingText} />

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
    <TransactionCompleted
      submitText={`Liquidity Added`}
      isShowButtton={type === 'card' ? false : true}
      onButtonClick={() => {
        onClose()
        onComplete()
      }}
      buttonText="Close"
    />
  )

  return (
    <Drawer
      title={noLiquidity ? t('addLiquidity.creatingPool') : t('addLiquidity.willReceive')}
      isOpen={isOpen}
      onClose={() => {
        type === 'card' ? onComplete() : onClose()
      }}
      backgroundColor={type === 'card' ? 'color5' : 'bg2'}
    >
      {poolErrorMessage
        ? ErroContent
        : txHash
        ? SubmittedContent
        : attemptingTxn
        ? PendingContent
        : type === 'detail'
        ? DetailConfirmContent
        : CardConfirmContent}
    </Drawer>
  )
}
export default ConfirmSwapDrawer
