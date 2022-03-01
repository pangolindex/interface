import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Pair } from '@pangolindex/sdk'
import { Link } from 'react-router-dom'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { StyledInternalLink, TYPE, Hidden, ExternalLink } from '../../theme'
import { Text } from 'rebass'
import Card from '../../components/Card'
import { RowBetween, RowFixed } from '../../components/Row'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { Dots } from '../../components/swap/styleds'
import { ChainId } from '@pangolindex/sdk'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import { LANDING_PAGE, ANALYTICS_PAGE } from '../../constants'
import { useTranslation } from 'react-i18next'

const LiquidityTutorial = LANDING_PAGE + 'tutorials/manage-liquidity'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const VoteCard = styled(DataCard)`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
  overflow: hidden;
`

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

const ButtonRow = styled(RowFixed)`
  gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row-reverse;
    justify-content: space-between;
  `};
`

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account, chainId } = useActiveWeb3React()

  const AccountAnalytics = account ? ANALYTICS_PAGE + '#/account/' + account : ANALYTICS_PAGE + '#/accounts'

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

  const hasV1Liquidity = undefined

  return (
    <>
      <PageWrapper>
        <SwapPoolTabs active={'pool'} />

        <VoteCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>{t('pool.liquidityProviderRewards')}</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>{t('pool.liquidityProvidersEarn')}</TYPE.white>
              </RowBetween>
              <ExternalLink
                style={{ color: 'white', textDecoration: 'underline' }}
                target="_blank"
                href={LiquidityTutorial}
              >
                <TYPE.white fontSize={14}>{t('pool.readMoreProviding')}</TYPE.white>
              </ExternalLink>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </VoteCard>

        <ExternalLink
          style={{ marginTop: '1.5rem', color: 'black', textDecoration: 'underline' }}
          target="_blank"
          href={AccountAnalytics}
        >
          <TYPE.black fontSize={18}>{t('pool.viewStakedLiquidity')}</TYPE.black>
        </ExternalLink>

        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
              <Hidden upToSmall={true}>
                <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                  {t('pool.yourLiquidity')}
                </TYPE.mediumHeader>
              </Hidden>
              <ButtonRow>
                <ResponsiveButtonSecondary as={Link} padding="6px 8px" to="/create/AVAX">
                  {t('pool.createPair')}
                </ResponsiveButtonSecondary>
                <ResponsiveButtonPrimary id="join-pool-button" as={Link} padding="6px 8px" to="/add/AVAX">
                  <Text fontWeight={500} fontSize={16}>
                    {t('pool.addLiquidity')}
                  </Text>
                </ResponsiveButtonPrimary>
              </ButtonRow>
            </TitleRow>

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
              <>
                {allV2PairsWithLiquidity.map(v2Pair => (
                  <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                ))}
              </>
            ) : (
              <EmptyProposals>
                <TYPE.body color={theme.text3} textAlign="center">
                  {t('pool.noLiquidity')}
                </TYPE.body>
              </EmptyProposals>
            )}

            <AutoColumn justify={'center'} gap="md">
              <Text textAlign="center" fontSize={14} style={{ padding: '.5rem 0 .5rem 0' }}>
                {hasV1Liquidity ? t('pool.uniswapV1Found') : t('pool.noSeePoolJoined')}{' '}
                <StyledInternalLink id="import-pool-link" to={hasV1Liquidity ? '/migrate/v1' : '/find'}>
                  {hasV1Liquidity ? t('pool.migrateNow') : t('pool.importIt')}
                </StyledInternalLink>
              </Text>
            </AutoColumn>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}
