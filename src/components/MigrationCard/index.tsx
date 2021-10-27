import React from 'react'
import { Pair, JSBI, Fraction } from '@pangolindex/sdk'
import { Panel, OptionButton, OptionsWrapper, Divider, MigrateButton, InnerWrapper } from './styleds'
import Stat from '../Stat'
import { Text, Box, DoubleCurrencyLogo } from '@pangolindex/components'
import { AutoRow } from '../Row'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
// import { unwrappedToken } from '../../utils/wrappedCurrency'
import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useGetStackingDataWithAPR } from '../../state/stake/hooks'
import { useTotalSupply } from '../../data/TotalSupply'
import useUSDCPrice from '../../utils/useUSDCPrice'
import numeral from 'numeral'

export interface StatProps {
  pair: Pair
}

const MigrationCard = ({ pair }: StatProps) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const params: any = useParams()
  const currency0 = pair.token0
  const currency1 = pair.token1

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)

  const stakingInfos = useGetStackingDataWithAPR(Number(params?.version))

  // get match token address value for stack data
  const stackingData = stakingInfos.find(data => data?.stakedAmount?.token?.address === pair?.liquidityToken?.address)

  const totalPoolTokens = useTotalSupply(pair.liquidityToken)
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

  return (
    <Panel>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Text color="text1" fontSize={42} fontWeight={500}>
            {currency0.symbol}-{currency1.symbol}
          </Text>
          <OptionsWrapper>
            <OptionButton active={true}>{stackingData?.multiplier ? `${stackingData?.multiplier}X` : '-'}</OptionButton>
            <OptionButton>{t('migratePage.lowVolatility')}</OptionButton>
            <OptionButton>{t('migratePage.compoundable')}</OptionButton>
          </OptionsWrapper>
        </Box>

        <DoubleCurrencyLogo size={55} currency0={currency0} currency1={currency1} />
      </Box>
      <Divider />

      <AutoRow gap="20px">
        <Stat
          title={t('migratePage.totalValueLocked')}
          stat={numeral((totalAmountUsd as Fraction)?.toSignificant(8)).format('$0.00 a')}
          titlePosition="top"
        />
        <Stat
          title={t('migratePage.apr')}
          stat={stackingData?.combinedApr ? `${stackingData?.combinedApr}%` : '-'}
          titlePosition="top"
        />
      </AutoRow>

      <InnerWrapper>
        <Box>
          <Stat
            title={t('migratePage.readyToMigrate')}
            stat={`${userPoolBalance ? userPoolBalance.toSignificant(4) : '-'} PGL`}
            titlePosition="bottom"
          />
        </Box>
        <Box>
          <MigrateButton variant="primary"> {t('migratePage.migrateNow')}</MigrateButton>
        </Box>
      </InnerWrapper>
    </Panel>
  )
}

export default MigrationCard
