import React from 'react'
import { InfoWrapper, DataBox, ContentBox } from './styleds'
import { Text, Box, DoubleCurrencyLogo, Steps, Step } from '@pangolindex/components'
import { JSBI, Pair, Percent, Fraction } from '@pangolindex/sdk'
import { useTokenBalance } from '../../../state/wallet/hooks'
import { useActiveWeb3React } from '../../../hooks'
import { useTotalSupply } from '../../../data/TotalSupply'
import useUSDCPrice from '../../../utils/useUSDCPrice'
import numeral from 'numeral'

export interface PoolInfoProps {
  pair: Pair
  type: 'unstake' | 'remove' | 'stake' | 'add'
}

const PoolInfo = ({ pair, type }: PoolInfoProps) => {
  const { account } = useActiveWeb3React()

  const currency0 = pair.token0
  const currency1 = pair.token1

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  const usdPriceCurrency0 = useUSDCPrice(currency0)
  const usdPriceCurrency1 = useUSDCPrice(currency1)

  const usdAmountCurrency0 = token0Deposited?.multiply(usdPriceCurrency0?.raw as Fraction)
  const usdAmountCurrency1 = token1Deposited?.multiply(usdPriceCurrency1?.raw as Fraction)

  const totalAmountUsd = usdAmountCurrency0?.add(usdAmountCurrency1 as Fraction)

  const renderPoolDataRow = (label: string, value: string) => {
    return (
      <DataBox>
        <Text color="text4" fontSize={16}>
          {label}
        </Text>

        <Text color="text4" fontSize={16}>
          {value}
        </Text>
      </DataBox>
    )
  }

  const currency0Row = { label: `${currency0.symbol} Amount:`, value: `${token0Deposited?.toSignificant(6)}` }
  const currency1Row = { label: `${currency1.symbol} Amount:`, value: `${token1Deposited?.toSignificant(6)}` }
  const dollerWorthRow = {
    label: 'Dollar Worth:',
    value: `${numeral((totalAmountUsd as Fraction)?.toSignificant(8)).format('$0.00 a')}`
  }
  const claimedRow = { label: 'Claimed Png:', value: '120.25' }
  const poolShareRow = {
    label: 'Share of Pool:',
    value: poolTokenPercentage ? poolTokenPercentage.toFixed(2) + '%' : '-'
  }

  let info = [] as any
  if (type === 'unstake') info = [currency0Row, currency1Row, dollerWorthRow, claimedRow]
  if (type === 'remove') info = [currency0Row, currency1Row, dollerWorthRow, poolShareRow]

  if (type === 'add') info = [dollerWorthRow, poolShareRow]
  if (type === 'stake') info = [currency0Row, currency1Row, dollerWorthRow, poolShareRow]

  //

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

      {type !== 'add' && (
        <Box mt={10}>
          <ContentBox>
            <DataBox>
              <Text color="text4" fontSize={24}>
                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
              </Text>

              <Text color="text4" fontSize={24}>
                PGL
              </Text>
            </DataBox>
          </ContentBox>
        </Box>
      )}

      {type !== 'add' && (
        <Box>
          <Steps onChange={() => {}} current={2} progressDot={true}>
            <Step />
            <Step />
            <Step />
            <Step />
            <Step />
          </Steps>
        </Box>
      )}

      <Box>
        <ContentBox>{info.map((item: any) => renderPoolDataRow(item.label, item.value))}</ContentBox>
      </Box>
    </InfoWrapper>
  )
}
export default PoolInfo
