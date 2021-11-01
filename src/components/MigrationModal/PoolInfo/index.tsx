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
  amount?: TokenAmount
  onChangeAmount?: (value: string) => void
}

const PoolInfo = ({
  pair,
  type,
  stakingInfo,
  amount,
  percentage,
  onChangePercentage,
  onChangeAmount
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
    label: 'Dollar Worth:',
    value: `${numeral((totalAmountUsd as Fraction)?.toSignificant(8)).format('$0.00 a')}`
  }

  const yourPngRate = {
    label: 'Your rate:',
    value: `${pngRate}    ${t('earnPage.rewardPerWeek', { symbol: 'PNG' })}`
  }

  const claimedRow = {
    label: 'unclaimed Png:',
    value: userLiquidityUnstaked ? `${unClaimedPng}` : '-'
  }
  const poolShareRow = {
    label: 'Share of Pool:',
    value: poolTokenPercentage ? poolTokenPercentage.toFixed(2) + '%' : '-'
  }

  let info = [] as any
  if (type === 'unstake') info = [yourPngRate, claimedRow]
  if (type === 'stake') info = [currency0Row, currency1Row, dollerWorthRow, poolShareRow]

  return (
    <InfoWrapper>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <DoubleCurrencyLogo size={25} currency0={currency0} currency1={currency1} />{' '}
          <Text color="text1" fontSize={16} ml={10}>
            {currency0.symbol}-{currency1.symbol} Pool
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
        Now you have chosen your pool then lets unstake you from there.
      </Text>

      <Box mt={10}>
        <TextBox
          value={amount ? amount.toSignificant(4) : '0.00'}
          addonAfter={
            <Text color="text4" fontSize={24}>
              PGL
            </Text>
          }
          onChange={v => {
            onChangeAmount && onChangeAmount((v?.target as any).value)
          }}
          addonLabel={
            type === 'stake' && (
              <Text color="text4" fontSize={12}>
                Available to deposit: {amount?.toSignificant(6)}
              </Text>
            )
          }
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
