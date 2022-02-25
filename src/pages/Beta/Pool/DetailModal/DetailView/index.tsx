import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { Wrapper, PanelWrapper, HeaderGridContainer, EarnWrapper, DetailContainer, TabView } from './styleds'
import { CAVAX, Fraction, ChainId, Token } from '@antiyro/sdk'
import { CloseIcon } from 'src/theme/components'
import { useTranslation } from 'react-i18next'
import { StakingInfo, useGetPoolDollerWorth } from 'src/state/stake/hooks'
import { Text, Box, DoubleCurrencyLogo } from '@pangolindex/components'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import Stat from 'src/components/Stat'
import numeral from 'numeral'
import { usePair } from 'src/data/Reserves'
import CoinDescription from 'src/components/Beta/CoinDescription'
import StatDetail from '../StatDetail'
import EarnWidget from '../../EarnWidget'
import EarnDetail from '../EarnDetail'
import { useWindowSize } from 'react-use'
import { useTokens } from 'src/hooks/Tokens'
import RewardTokens from 'src/components/RewardTokens'
import { useActiveWeb3React } from 'src/hooks'
import { CHAINS } from 'src/constants/chains'

export interface PoolDetailProps {
  onDismiss: () => void
  stakingInfo: StakingInfo
  version: number
  onOpenClaimModal: () => void
  onOpenWithdrawModal: () => void
}

const DetailView = ({ stakingInfo, onDismiss, version, onOpenClaimModal, onOpenWithdrawModal }: PoolDetailProps) => {
  const theme = useContext(ThemeContext)
  const { height } = useWindowSize()
  const { t } = useTranslation()
  const token0 = stakingInfo?.tokens[0]
  const token1 = stakingInfo?.tokens[1]
  const { chainId } = useActiveWeb3React()

  const currency0 = unwrappedToken(token0, chainId || ChainId.AVALANCHE)
  const currency1 = unwrappedToken(token1, chainId || ChainId.AVALANCHE)

  const totalStakedInUsd = CHAINS[chainId || ChainId.AVALANCHE].is_mainnet ? numeral(stakingInfo.totalStakedInUsd.toSignificant(4)).format('$0.00a') : 0

  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))

  let yourStackedInUsd = CHAINS[chainId || ChainId.AVALANCHE].is_mainnet ? stakingInfo?.totalStakedInUsd
    .multiply(stakingInfo?.stakedAmount)
    .divide(stakingInfo?.totalStakedAmount) : undefined


  const [, stakingTokenPair] = usePair(token0, token1)
  const pair = stakingTokenPair
  //ATTENTION ICI
  const { userPgl, liquidityInUSD } = useGetPoolDollerWorth(pair)
  const rewardTokens = useTokens(stakingInfo?.rewardTokensAddress)

  return (
    <Wrapper style={{ maxHeight: height - 150 }}>
      <HeaderGridContainer>
        <Box padding={'0px 50px'} display="flex" alignItems="center">
          <DoubleCurrencyLogo size={24} currency0={currency0} currency1={currency1} />
          <Text color="text1" fontSize={24} fontWeight={500} lineHeight="55px" marginLeft={10}>
            {currency0?.symbol}/{currency1?.symbol}
          </Text>
        </Box>
        <PanelWrapper>
          <Box display="inline-block" padding="10px 6px">
            <Text color="text2" fontSize={14}>
              {t('earn.poolRewards')}
            </Text>

            <Box display="flex" alignItems="center" mt="5px">
              <RewardTokens rewardTokens={rewardTokens} size={24} />
            </Box>
          </Box>

          <Box padding="10px 6px">
            <Stat
              title={`Swap fee APR:`}
              stat={`${stakingInfo?.swapFeeApr && !stakingInfo.isPeriodFinished ? `${stakingInfo?.swapFeeApr}%` : '-'}`}
              titlePosition="top"
              titleFontSize={14}
              statFontSize={24}
              titleColor="text2"
            />
          </Box>

          <Box padding="10px 6px">
            <Stat
              title={`Reward APR:`}
              stat={`${stakingInfo?.stakingApr && !stakingInfo.isPeriodFinished ? `${stakingInfo?.stakingApr}%` : '-'}`}
              titlePosition="top"
              titleFontSize={14}
              statFontSize={24}
              titleColor="text2"
            />
          </Box>

          <Box padding="10px 6px">
            <Stat
              title={`Total APR:`}
              stat={`${
                stakingInfo?.swapFeeApr && !stakingInfo.isPeriodFinished
                  ? `${stakingInfo?.swapFeeApr + (stakingInfo?.stakingApr || 0)}%`
                  : '-'
              }`}
              titlePosition="top"
              titleFontSize={14}
              statFontSize={24}
              titleColor="text2"
            />
          </Box>
        </PanelWrapper>
        <Box mt={20}>
          <CloseIcon onClick={onDismiss} color={theme.text3} />
        </Box>
      </HeaderGridContainer>

      <Box display="flex">
        <Box borderRight={`1px solid ${theme.text9}`} flex={1} display="flex" flexDirection="column">
          <TabView>
            <Text color="text10" fontSize={18}>
              Details
            </Text>
          </TabView>
          <DetailContainer>
            <StatDetail
              title={`Total Stake`}
              currency0={currency0}
              currency1={currency1}
              pair={pair}
              totalAmount={`${totalStakedInUsd}`}
              pgl={stakingInfo?.totalStakedAmount}
            />

            {Number(liquidityInUSD?.toFixed(4)) > 0 && (
              <Box mt={25}>
                <StatDetail
                  title={`Your Liquidity`}
                  currency0={currency0}
                  currency1={currency1}
                  pair={pair}
                  totalAmount={`${liquidityInUSD ? `$${liquidityInUSD?.toFixed(4)}` : '-'}`}
                  pgl={userPgl}
                />
              </Box>
            )}

            {isStaking && (
              <Box mt={25}>
                <StatDetail
                  title={`Your Stake`}
                  currency0={currency0}
                  currency1={currency1}
                  pair={pair}
                  totalAmount={`${numeral((yourStackedInUsd as Fraction)?.toFixed(2)).format('$0.00a')}`}
                  pgl={stakingInfo?.stakedAmount}
                />
              </Box>
            )}
            {currency0 !== CAVAX[chainId || ChainId.AVALANCHE] && currency0 instanceof Token && (
              <Box mt={20}>
                <CoinDescription coin={currency0} />
              </Box>
            )}
            {currency1 !== CAVAX[chainId || ChainId.AVALANCHE]  && currency1 instanceof Token && (
              <Box mt={20}>
                <CoinDescription coin={currency1} />
              </Box>
            )}
          </DetailContainer>
        </Box>

        <EarnWrapper>
          <EarnWidget currencyA={currency0} currencyB={currency1} version={version} pair={pair} />
          {isStaking && (
            <EarnDetail
              stakingInfo={stakingInfo}
              onOpenClaimModal={onOpenClaimModal}
              onOpenWithdrawModal={onOpenWithdrawModal}
            />
          )}
        </EarnWrapper>
      </Box>
    </Wrapper>
  )
}
export default DetailView
