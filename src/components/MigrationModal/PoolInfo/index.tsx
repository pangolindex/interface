import React from 'react'
import { InfoWrapper, DataBox, ContentBox, TextBox } from './styleds'
import { Text, Box, DoubleCurrencyLogo, Steps, Step } from '@pangolindex/components'
import { Pair, Fraction, TokenAmount } from '@pangolindex/sdk'
import { useGetPairDataFromPair } from '../../../state/stake/hooks'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'
import { StakingInfo } from '../../../state/stake/hooks'
import { useTokenBalance } from '../../../state/wallet/hooks'
import { useActiveWeb3React } from '../../../hooks'

export interface PoolInfoProps {
  pair: Pair
  type: 'unstake' | 'remove' | 'stake' | 'add'
  stakingInfo?: StakingInfo | undefined
  percentage?: number
  onChangePercentage?: (value: number) => void
  amount?: string
  onChangeAmount?: (value: string) => void
  userPoolBalance?: TokenAmount
  unStakeAmount?: TokenAmount
}

const PoolInfo = ({
  pair,
  type,
  stakingInfo,
  amount,
  percentage,
  onChangePercentage,
  onChangeAmount,
  userPoolBalance,
  unStakeAmount
}: PoolInfoProps) => {
  const { account } = useActiveWeb3React()

  const { t } = useTranslation()

  const {
    currency0,
    currency1,
    token0Deposited,
    token1Deposited,
    totalAmountUsd,
    poolTokenPercentage
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

  const pngRate =
    stakingInfo?.rewardRate?.multiply((60 * 60 * 24 * 7).toString())?.toSignificant(4, { groupSeparator: ',' }) ?? '-'

  const currency0Row = { label: `${currency0.symbol} Amount:`, value: `${token0Deposited?.toSignificant(6)}` }
  const currency1Row = { label: `${currency1.symbol} Amount:`, value: `${token1Deposited?.toSignificant(6)}` }
  const dollerWorthRow = {
    label: `${t('migratePage.dollerWarth')}`,
    value: `${numeral((totalAmountUsd as Fraction)?.toFixed(2)).format('$0.00 a')}`
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
    value: poolTokenPercentage ? poolTokenPercentage.toFixed(2) + '%' : '-'
  }

  let info = [] as any
  if (type === 'unstake') info = [yourPngRate, unClaimedRow]
  if (type === 'stake') info = [currency0Row, currency1Row, dollerWorthRow, poolShareRow]

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
          {t('migratePage.availableToUnstake')} {unStakeAmount?.toSignificant(6)}
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

        {/* <Box display="flex" alignItems="center">
          <Text color="text1" fontSize={16} mr={10}>
            Trader JOE
          </Text>
          <IconWrapper size={16}>
            <img src={CoinbaseWalletIcon} alt={'CoinbaseWallet'} />
          </IconWrapper>
        </Box> */}
      </Box>

      <Text color="text4" fontSize={16} mt={10}>
        {t('migratePage.poolInfoDescription')}
      </Text>

      <Box mt={10}>
        <TextBox
          value={amount ? amount : ''}
          addonAfter={
            <Text color="text4" fontSize={24}>
              PGL
            </Text>
          }
          onChange={(v: any) => {
            onChangeAmount && onChangeAmount(v)
          }}
          addonLabel={addonLabel()}
          fontSize={24}
          isNumeric={true}
          placeholder="0.00"
        />
      </Box>

      <Box>
        <Steps
          onChange={t => {
            onChangePercentage && onChangePercentage(t)
          }}
          current={percentage}
          progressDot={true}
        >
          <Step />
          <Step />
          <Step />
          <Step />
          <Step />
        </Steps>
      </Box>

      <Box>
        <ContentBox>{info.map((item: any) => renderPoolDataRow(item.label, item.value))}</ContentBox>
      </Box>
    </InfoWrapper>
  )
}
export default PoolInfo
