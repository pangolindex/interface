import React from 'react'
import { JSBI, Pair, Percent, Currency, ChainId } from '@antiyro/sdk'
import { Wrapper, InnerWrapper } from './styleds'
import { Text, Box, Button, DoubleCurrencyLogo } from '@0xkilo/components'
import { useTranslation } from 'react-i18next'
import Stat from 'src/components/Stat'
import { useActiveWeb3React } from 'src/hooks'
import { useTokenBalance } from 'src/state/wallet/hooks'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import { useTotalSupply } from 'src/data/TotalSupply'

export interface PositionCardProps {
  pair: Pair
  onManagePoolsClick: () => void
}

const PositionCard = ({ pair, onManagePoolsClick }: PositionCardProps) => {
  const { account, chainId } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair?.token0, chainId || ChainId.AVALANCHE)
  const currency1 = unwrappedToken(pair?.token1, chainId || ChainId.AVALANCHE)

  const { t } = useTranslation()

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
  return (
    <Wrapper>
      <Text fontSize={16} color="oceanBlue">
        {t('poolFinder.poolFound')}
      </Text>

      <Box display="flex" flexDirection="column" mt={10}>
        <Text fontWeight={500} color="color6" fontSize={16}>
          {t('positionCard.yourPosition')}
        </Text>

        <Box display="flex" alignItems="center">
          <DoubleCurrencyLogo size={24} currency0={currency0 as Currency} currency1={currency1 as Currency} />

          <Box marginLeft={10}>
            <Text color="text1" fontSize={20} fontWeight={500}>
              {currency0?.symbol}/{currency1?.symbol}
            </Text>
          </Box>
        </Box>
      </Box>

      <InnerWrapper>
        <Box>
          <Stat
            title={'PGL'}
            stat={`${userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}`}
            titlePosition="top"
            titleFontSize={14}
            statFontSize={20}
            titleColor="text2"
          />
        </Box>

        <Box>
          <Stat
            title={t('positionCard.poolShare')}
            stat={`${poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}`}
            titlePosition="top"
            titleFontSize={14}
            statFontSize={20}
            titleColor="text2"
          />
        </Box>
      </InnerWrapper>

      <InnerWrapper>
        <Box>
          <Stat
            title={currency0.symbol}
            stat={`${token0Deposited ? token0Deposited?.toSignificant(6) : '-'}`}
            titlePosition="top"
            titleFontSize={14}
            statFontSize={20}
            titleColor="text2"
          />
        </Box>

        <Box>
          <Stat
            title={currency1.symbol}
            stat={`${token1Deposited ? token1Deposited?.toSignificant(6) : '-'}`}
            titlePosition="top"
            titleFontSize={14}
            statFontSize={20}
            titleColor="text2"
          />
        </Box>
      </InnerWrapper>

      <Box mt={10}>
        <Box mr="5px" width="100%">
          <Button variant={'primary'} onClick={onManagePoolsClick}>
            {t('positionCard.manage')}
          </Button>
        </Box>
      </Box>
    </Wrapper>
  )
}
export default PositionCard
