import React from 'react'
import { InfoWrapper, DataBox, ContentBox, TextBox, StyledBalanceMax } from './styleds'
import { Text, Box, DoubleCurrencyLogo, Steps, Step } from '@pangolindex/components'
import { Pair, TokenAmount } from '@pangolindex/sdk'
import { useGetPairDataFromPair } from '../../../state/stake/hooks'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'
import { StakingInfo } from '../../../state/stake/hooks'
import { useTokenBalance } from '../../../state/wallet/hooks'
import { useActiveWeb3React } from '../../../hooks'
import { wrappedCurrencyAmount } from '../../../utils/wrappedCurrency'
import { tryParseAmount } from '../../../state/swap/hooks'
import { JSBI, ChainId } from '@pangolindex/sdk'

export interface PoolInfoProps {
  pair: Pair
  type: 'unstake' | 'remove' | 'stake' | 'add'
  stakingInfo?: StakingInfo | undefined
  stepIndex?: number
  onChangeDot?: (value: number) => void
  amount?: string
  onChangeAmount?: (value: string) => void
  userPoolBalance?: TokenAmount
  onMax: () => void
}

const PoolInfo = ({
  pair,
  type,
  stakingInfo,
  amount,
  stepIndex,
  onChangeDot,
  onChangeAmount,
  userPoolBalance,
  onMax
}: PoolInfoProps) => {
  const { account, chainId } = useActiveWeb3React()

  const { t } = useTranslation()

  const {
    currency0,
    currency1,
    token0Deposited,
    token1Deposited,
    totalAmountUsd,
    totalPoolTokens,
    getHypotheticalPoolOwnership
  } = useGetPairDataFromPair(pair)

  const renderPoolDataRow = (label: string, value: string) => {
    return (
      <DataBox key={label}>
        <Text color="text4" fontSize={16}>
          {label}
        </Text>

        <Text color="text4" fontSize={16}>
          {value}
        </Text>
      </DataBox>
    )
  }

  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token) as TokenAmount

  const unClaimedPng = stakingInfo?.earnedAmount?.toFixed(6) ?? '0'

  const parsedAmount = tryParseAmount(chainId ? chainId : ChainId.AVALANCHE, amount, stakingInfo?.stakedAmount?.token)
  const parsedAmountWrapped = wrappedCurrencyAmount(parsedAmount, chainId)

  const poolOwnership = getHypotheticalPoolOwnership(
    parsedAmountWrapped ? stakingInfo?.stakedAmount.add(parsedAmountWrapped).raw : stakingInfo?.stakedAmount.raw,
    parsedAmountWrapped ? totalPoolTokens?.add(parsedAmountWrapped).raw : totalPoolTokens?.raw
  )

  const pngRate = stakingInfo?.rewardRatePerWeek?.toSignificant(4, { groupSeparator: ',' })

  const currency0Row = {
    label: `${currency0.symbol} Amount:`,
    value: `${token0Deposited
      ?.multiply(parsedAmount || JSBI.BigInt(0))
      .divide(userPoolBalance?.greaterThan('0') ? userPoolBalance : JSBI.BigInt(1))
      .toSignificant(6)}`
  }

  const currency1Row = {
    label: `${currency1.symbol} Amount:`,
    value: `${token1Deposited
      ?.multiply(parsedAmount || JSBI.BigInt(0))
      .divide(userPoolBalance?.greaterThan('0') ? userPoolBalance : JSBI.BigInt(1))
      .toSignificant(6)}`
  }

  const dollarWorthRow = {
    label: `${t('migratePage.dollarWorth')}`,
    value: `${numeral(
      totalAmountUsd
        ?.multiply(parsedAmount || JSBI.BigInt(0))
        .divide(userPoolBalance?.greaterThan('0') ? userPoolBalance : JSBI.BigInt(1))
        ?.toFixed(2)
    ).format('$0.00a')}`
  }

  const yourPngRate = {
    label: `${t('migratePage.yourRate')}`,
    value: `${pngRate}    ${t('earnPage.rewardPerWeek', { symbol: 'PNG' })}`
  }

  const unClaimedRow = {
    label: `${t('migratePage.unclaimedPng')}`,
    value: userLiquidityUnstaked ? `${unClaimedPng}` : '-'
  }
  const poolShareRow = {
    label: `${t('migratePage.shareOfPool')}`,
    value: poolOwnership ? poolOwnership.toFixed(2) + '%' : '-'
  }

  let info = [] as Array<{ label: string; value: string }>
  if (type === 'unstake') info = [yourPngRate, unClaimedRow]
  if (type === 'stake') info = [currency0Row, currency1Row, dollarWorthRow, poolShareRow]

  const addonLabel = () => {
    if (type === 'stake') {
      return (
        <Text color="text4" fontSize={12}>
          {t('migratePage.availableToDeposit')} {userPoolBalance?.toSignificant(6)}
        </Text>
      )
    } else {
      return (
        <Text color="text4" fontSize={12}>
          {t('migratePage.availableToUnstake')} {stakingInfo?.stakedAmount?.toSignificant(6)}
        </Text>
      )
    }
  }

  return (
    <InfoWrapper>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <DoubleCurrencyLogo size={25} currency0={currency0} currency1={currency1} />{' '}
          <Text color="text1" fontSize={16} ml={10}>
            {currency0.symbol}-{currency1.symbol} {t('migratePage.pool')}
          </Text>
        </Box>
      </Box>

      {type === 'stake' && (
        <>
          <Text color="text4" fontSize={16} mt={10}>
            {t('migratePage.poolInfoDescription')}
          </Text>

          <Box mt={10}>
            <TextBox
              value={amount ? amount : ''}
              addonAfter={
                <Box display="flex" alignItems="center">
                  <StyledBalanceMax onClick={onMax}>{t('currencyInputPanel.max')}</StyledBalanceMax>

                  <Text color="text4" fontSize={24}>
                    PGL
                  </Text>
                </Box>
              }
              onChange={(value: any) => {
                onChangeAmount && onChangeAmount(value)
              }}
              addonLabel={addonLabel()}
              fontSize={24}
              isNumeric={true}
              placeholder="0.00"
            />
          </Box>

          <Box>
            <Steps
              onChange={value => {
                onChangeDot && onChangeDot(value)
              }}
              current={stepIndex}
              progressDot={true}
            >
              <Step />
              <Step />
              <Step />
              <Step />
              <Step />
            </Steps>
          </Box>
        </>
      )}

      <Box>
        <ContentBox>{info.map(item => renderPoolDataRow(item.label, item.value))}</ContentBox>
      </Box>
    </InfoWrapper>
  )
}
export default PoolInfo
