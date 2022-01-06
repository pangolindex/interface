import React, { useContext, useMemo } from 'react'
import { ThemeContext } from 'styled-components'
import { Pair } from '@pangolindex/sdk'
import { useTokenBalancesWithLoadingIndicator } from 'src/state/wallet/hooks'
import { TYPE } from 'src/theme'
import Card from 'src/components/Card'
import { useActiveWeb3React } from 'src/hooks'
import { usePairs } from 'src/data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'src/state/user/hooks'
import { Dots } from 'src/components/swap/styleds'
import { ChainId } from '@pangolindex/sdk'
import { useTranslation } from 'react-i18next'
import { PageWrapper, EmptyProposals, PanelWrapper } from './styleds'
import WalletCard from './WalletCard'
import Scrollbars from 'react-custom-scrollbars'

export default function Wallet() {
  const theme = useContext(ThemeContext)
  const { account, chainId } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const { t } = useTranslation()
  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map(tokens => ({
        liquidityToken: toV2LiquidityToken(tokens, chainId ? chainId : ChainId.AVALANCHE),
        tokens
      })),
    [trackedTokenPairs, chainId]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  return (
    <PageWrapper>
      {!account ? (
        <Card padding="40px">
          <TYPE.body color={theme.text3} textAlign="center">
            {t('pool.connectWalletToView')}
          </TYPE.body>
        </Card>
      ) : v2IsLoading ? (
        <EmptyProposals>
          <TYPE.body color={theme.text3} textAlign="center">
            <Dots>{t('pool.loading')}</Dots>
          </TYPE.body>
        </EmptyProposals>
      ) : allV2PairsWithLiquidity?.length > 0 ? (
        <Scrollbars>
          <PanelWrapper>
            {allV2PairsWithLiquidity.map(v2Pair => (
              <WalletCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
            ))}
          </PanelWrapper>
        </Scrollbars>
      ) : (
        <EmptyProposals>
          <TYPE.body color={theme.text3} textAlign="center">
            {t('pool.noLiquidity')}
          </TYPE.body>
        </EmptyProposals>
      )}
    </PageWrapper>
  )
}
