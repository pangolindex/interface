import React, { useMemo } from 'react'
import {
  PageWrapper,
  ResponsiveButtonPrimary,
  ResponsiveButtonOutline,
  ButtonRow,
  FirstWrapper,
  StyledMenuIcon,
  PanelWrapper,
  InfoWrapper,
  CircleIcon,
  ProcessWrapper,
  ArrowRight,
  EmptyProposals
} from './styleds'
import { Pair } from '@pangolindex/sdk'
import { ChainId } from '@pangolindex/sdk'
import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { Dots } from '../../components/swap/styleds'
import { Text, Box } from '@pangolindex/components'
import StatCard from '../../components/StatCard'
import MigrationCard from '../../components/MigrationCard'
import { useTranslation } from 'react-i18next'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'

export default function Migrate() {
  const below1080 = false
  const { t } = useTranslation()

  const { account, chainId } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()

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
      <FirstWrapper>
        <Text color="text1" fontSize={48} mb={20}>
          {t('migratePage.moveYourTokensToNewContracts')}
        </Text>
        <Text color="text1" fontSize={24} mb={20}>
          {t('migratePage.moveYourTokensToNewContractsDescription')}
        </Text>

        <ButtonRow>
          <ResponsiveButtonPrimary variant="primary">{t('migratePage.migrateNow')}</ResponsiveButtonPrimary>
          <ResponsiveButtonOutline variant="outline">{t('migratePage.learn')}</ResponsiveButtonOutline>
        </ButtonRow>
      </FirstWrapper>

      <PanelWrapper style={{ marginTop: below1080 ? '0' : '50px' }}>
        <StatCard icon={<StyledMenuIcon />} title={t('migratePage.alreadyMigrate')} stat={`250.000.000$`} />

        <StatCard icon={<StyledMenuIcon />} title={t('migratePage.walletMigrate')} stat={`2.435`} />

        <StatCard icon={<StyledMenuIcon />} title={t('migratePage.alreadyEarned')} stat={`150.000$`} />
      </PanelWrapper>

      <InfoWrapper>
        <Box>
          <Text color="text1" fontSize={48} mb={10}>
            {t('migratePage.migrateWithEase')}
          </Text>
          <Text color="text1" fontSize={24}>
            {t('migratePage.migrateWithDescription')}
          </Text>
        </Box>
        <ProcessWrapper>
          <Box display="inline-block">
            <CircleIcon>
              <StyledMenuIcon />
            </CircleIcon>
            <Text color="text1" fontSize={24} mt={10}>
              {t('migratePage.unstake')}
            </Text>
          </Box>

          <ArrowRight />

          <Box display="inline-block">
            <CircleIcon>
              <StyledMenuIcon />
            </CircleIcon>
            <Text color="text1" fontSize={24} mt={10}>
              {t('migratePage.remove')}
            </Text>
          </Box>

          <ArrowRight />
          <Box display="inline-block">
            <CircleIcon>
              <StyledMenuIcon />
            </CircleIcon>
            <Text color="text1" fontSize={24} mt={10}>
              {t('migratePage.add')}
            </Text>
          </Box>
          <ArrowRight />
          <Box display="inline-block">
            <CircleIcon>
              <StyledMenuIcon />
            </CircleIcon>
            <Text color="text1" fontSize={24} mt={10}>
              {t('migratePage.stack')}
            </Text>
          </Box>
        </ProcessWrapper>
      </InfoWrapper>

      <Box mt={50}>
        <Box textAlign="center">
          <Text color="text1" fontSize={48} mb={10}>
            {t('migratePage.startMigratingNow')}
          </Text>
          <Text color="text1" fontSize={24}>
            {t('migratePage.startMigratingNowDescription')}
          </Text>
        </Box>

        {!account ? (
          <Box padding="40px">
            <Text color="text3" textAlign="center" fontSize={24}>
              {t('pool.connectWalletToView')}
            </Text>
          </Box>
        ) : v2IsLoading ? (
          <EmptyProposals>
            <Text color="text3" textAlign="center" fontSize={24}>
              <Dots>{t('pool.loading')}</Dots>
            </Text>
          </EmptyProposals>
        ) : allV2PairsWithLiquidity?.length > 0 ? (
          <PanelWrapper style={{ marginTop: below1080 ? '0' : '50px' }}>
            {allV2PairsWithLiquidity.map(v2Pair => (
              <MigrationCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
            ))}
          </PanelWrapper>
        ) : (
          <EmptyProposals>
            <Text color="text3" textAlign="center" fontSize={24}>
              {t('pool.noLiquidity')}
            </Text>
          </EmptyProposals>
        )}

        <Box display="flex" justifyContent="center" mt={30}>
          <ResponsiveButtonPrimary variant="primary" width="200px">
            {t('migratePage.seeMore')}
          </ResponsiveButtonPrimary>
        </Box>
      </Box>
    </PageWrapper>
  )
}
