import React, { useState, useContext } from 'react'
import {
  PageWrapper,
  ResponsiveButtonPrimary,
  ResponsiveButtonOutline,
  ButtonRow,
  FirstWrapper,
  PanelWrapper,
  InfoWrapper,
  CircleIcon,
  ProcessWrapper,
  ArrowRight,
  EmptyProposals,
  StatisticImage,
  HideSmall
} from './styleds'
import { Pair } from '@pangolindex/sdk'
import { useParams } from 'react-router-dom'
import { useActiveWeb3React } from '../../hooks'
import { Dots } from '../../components/swap/styleds'
import { Text, Box } from '@pangolindex/components'
import MigrationCard from '../../components/MigrationCard'
import { useTranslation } from 'react-i18next'
import MigrationModal from '../../components/MigrationModal'
import { useMigrationModalToggle } from '../../state/application/hooks'
import { useGetMigrationData } from '../../state/migrate/hooks'
import { StakingInfo } from '../../state/stake/hooks'
import MigrationVector from '../../assets/images/migration_vector.png'
import Stake from '../../assets/svg/stake.svg'
import Unstake from '../../assets/svg/unstake.svg'
import { ThemeContext } from 'styled-components'

const MigrateUI = () => {
  const below1080 = false
  const { t } = useTranslation()
  const params: any = useParams()
  const [selectedPool, setSelectedPool] = useState({} as { [address: string]: { pair: Pair; staking: StakingInfo } })
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const toggleMigrationModal = useMigrationModalToggle()

  const { allPool, v2IsLoading } = useGetMigrationData(params?.version)

  return (
    <PageWrapper>
      <FirstWrapper>
        <Box maxWidth={500}>
          <Text color="text1" fontSize={32} mb={20} fontWeight="900" lineHeight="48px">
            {t('migratePage.moveYourTokensToNewContracts')}
          </Text>
          <Text color="text1" fontSize={18} mb={20} lineHeight="24px">
            {t('migratePage.moveYourTokensToNewContractsDescription')}
          </Text>

          <ButtonRow>
            <ResponsiveButtonPrimary
              variant="primary"
              onClick={() => {
                setSelectedPool(null as any)
                toggleMigrationModal()
              }}
              isDisabled={Object.keys(allPool)?.length === 0}
            >
              {t('migratePage.migrateNow')}
            </ResponsiveButtonPrimary>
            <ResponsiveButtonOutline
              variant="outline"
              color={theme.color4}
              href="https://docs.pangolin.exchange/learn-how-to/migrate-to-v2-farms"
            >
              {t('migratePage.learn')}
            </ResponsiveButtonOutline>
          </ButtonRow>
        </Box>
        <HideSmall>
          <Box pt={40}>
            <img src={MigrationVector} alt="Migration" />
          </Box>
        </HideSmall>
      </FirstWrapper>

      {/*<PanelWrapper style={{ marginTop: below1080 ? '0' : '50px' }}>*/}
      {/*  <StatCard*/}
      {/*    icon={<StatisticImage src={AlreadyMigrate} alt="Already Migrate" />}*/}
      {/*    title={t('migratePage.alreadyMigrate')}*/}
      {/*    stat={`$250.000`}*/}
      {/*  />*/}

      {/*  <StatCard*/}
      {/*    icon={<StatisticImage src={WalletMigrated} alt="Wallet Migrated" />}*/}
      {/*    title={t('migratePage.walletMigrate')}*/}
      {/*    stat={`2.435`}*/}
      {/*  />*/}

      {/*  <StatCard*/}
      {/*    icon={<StatisticImage src={AlreadyEarned} alt="Alread yEarned" />}*/}
      {/*    title={t('migratePage.alreadyEarned')}*/}
      {/*    stat={`$150.000`}*/}
      {/*  />*/}
      {/*</PanelWrapper>*/}

      <InfoWrapper>
        <Box>
          <Text color="text1" fontSize={32} mb={10} fontWeight="900">
            {t('migratePage.migrateWithEase')}
          </Text>
          <Text color="text1" fontSize={16}>
            {t('migratePage.migrateWithDescription')}
          </Text>
        </Box>
        <ProcessWrapper>
          <Box display="inline-block">
            <CircleIcon>
              <StatisticImage src={Unstake} alt="Already Migrate" />
            </CircleIcon>
            <Text color="text1" fontSize={18} mt={10}>
              {t('migratePage.unstake')}
            </Text>
          </Box>

          <ArrowRight />
          <Box display="inline-block">
            <CircleIcon>
              <StatisticImage src={Stake} alt="Already Migrate" />
            </CircleIcon>
            <Text color="text1" fontSize={18} mt={10}>
              {t('migratePage.stake')}
            </Text>
          </Box>
        </ProcessWrapper>
      </InfoWrapper>

      <Box mt={50}>
        <Box textAlign="center">
          <Text color="text1" fontSize={24} mb={10} fontWeight="900">
            {t('migratePage.startMigratingNow')}
          </Text>
          <Text color="text1" fontSize={16}>
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
            <Text color="text3" textAlign="center" fontSize={16}>
              <Dots>{t('pool.loading')}</Dots>
            </Text>
          </EmptyProposals>
        ) : Object.values(allPool)?.length > 0 ? (
          <PanelWrapper style={{ marginTop: below1080 ? '0' : '50px' }}>
            {Object.values(allPool).map(pool => (
              <MigrationCard
                key={pool?.pair?.liquidityToken.address}
                pair={pool?.pair}
                stakingData={pool?.staking}
                onClickMigrate={() => {
                  let container = {} as { [address: string]: { pair: Pair; staking: StakingInfo } }
                  container[pool?.pair?.liquidityToken.address] = pool
                  setSelectedPool(container)
                  toggleMigrationModal()
                }}
              />
            ))}
          </PanelWrapper>
        ) : (
          <EmptyProposals>
            <Text color="text3" textAlign="center" fontSize={24}>
              {t('pool.noLiquidity')}
            </Text>
          </EmptyProposals>
        )}

        {/* <Box display="flex" justifyContent="center" mt={30}>
          <ResponsiveButtonPrimary variant="primary" width="200px">
            {t('migratePage.seeMore')}
          </ResponsiveButtonPrimary>
        </Box> */}
      </Box>
      <MigrationModal selectedPool={selectedPool} version={params?.version} />
    </PageWrapper>
  )
}
export default MigrateUI
