import React, { useCallback, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { JSBI, Token, Currency, TokenAmount } from '@pangolindex/sdk'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { useWalletModalToggle } from '../../state/application/hooks'
import { TYPE } from '../../theme'
import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import { ButtonPrimary } from '../../components/Button'
import StakingModal from '../../components/earn/StakingModal'
import { DoubleSideStakingInfo, useMinichefPools } from '../../state/stake/hooks'
import UnstakingModal from '../../components/earn/UnstakingModal'
import ClaimRewardModal from '../../components/earn/ClaimRewardModal'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useColor } from '../../hooks/useColor'
import { currencyId } from '../../utils/currencyId'
import { BIG_INT_ZERO } from '../../constants'
import { useTranslation } from 'react-i18next'
import RewardCard from './RewardCard'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const PositionInfo = styled(AutoColumn)<{ dim: any }>`
  position: relative;
  max-width: 640px;
  width: 100%;
  opacity: ${({ dim }) => (dim ? 0.6 : 1)};
`

const BottomSection = styled(AutoColumn)`
  border-radius: 12px;
  width: 100%;
  position: relative;
`

const StyledDataCard = styled(DataCard)<{ bgColor?: any; showBackground?: any }>`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #1e1a31 0%, #3d51a5 100%);
  z-index: 2;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: ${({ theme, bgColor, showBackground }) =>
    `radial-gradient(91.85% 100% at 1.84% 0%, ${bgColor} 0%,  ${showBackground ? theme.black : theme.bg5} 100%) `};
`

const PoolData = styled(DataCard)`
  background: none;
  border: 1px solid ${({ theme }) => theme.bg4};
  padding: 1rem;
  z-index: 1;
`

const VoteCard = styled(DataCard)`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
  overflow: hidden;
`

const DataRow = styled(RowBetween)`
  justify-content: center;
  gap: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
     flex-direction: column;
     gap: 12px;
   `};
`

const MainDataRow = styled(RowBetween)`
  justify-content: start;
  align-items: start;
  gap: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
     flex-direction: column;
     gap: 12px;
   `};
`

export interface ManageProps {
  version: string
  stakingInfo: DoubleSideStakingInfo
  currencyA: Currency | null | undefined
  currencyB: Currency | null | undefined
  extraRewardTokensAmount?: Array<TokenAmount>
}

const Manage: React.FC<ManageProps> = ({ version, stakingInfo, currencyA, currencyB, extraRewardTokensAmount }) => {
  const { account } = useActiveWeb3React()

  let backgroundColor: string
  let token: Token | undefined

  // get the color of the token
  backgroundColor = useColor(token)

  // detect existing unstaked LP position to show add button if none found
  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token)
  const showAddLiquidityButton = Boolean(stakingInfo?.stakedAmount?.equalTo('0') && userLiquidityUnstaked?.equalTo('0'))

  // toggle for staking modal and unstaking modal
  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  // fade cards if nothing staked or nothing earned yet
  const disableTop = !stakingInfo?.stakedAmount || stakingInfo.stakedAmount.equalTo(BIG_INT_ZERO)

  const toggleWalletModal = useWalletModalToggle()
  const { t } = useTranslation()

  const handleDepositClick = useCallback(() => {
    if (account) {
      setShowStakingModal(true)
    } else {
      toggleWalletModal()
    }
  }, [account, toggleWalletModal])

  const poolMap = useMinichefPools()
  let pairAddress = stakingInfo?.stakedAmount?.token?.address
  let isSuperFarm = (extraRewardTokensAmount || [])?.length > 0

  const getUserRewardRate = (rewardRate: TokenAmount, token: Token, tokenMultiplier: JSBI | undefined) => {
    const TEN_EIGHTEEN = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))
    const rewardMultiplier = JSBI.BigInt(tokenMultiplier || 1) || JSBI.BigInt(1)
    const finalReward = JSBI.divide(JSBI.multiply(rewardMultiplier, rewardRate?.raw), TEN_EIGHTEEN)
    const userRewardRate = new TokenAmount(token, finalReward)
    return userRewardRate
  }

  return (
    <PageWrapper gap="lg" justify="center">
      <RowBetween style={{ gap: '24px' }}>
        <TYPE.mediumHeader style={{ margin: 0 }}>
          {currencyA?.symbol}-{currencyB?.symbol} {t('earnPage.liquidityMining')}
        </TYPE.mediumHeader>
        <DoubleCurrencyLogo currency0={currencyA ?? undefined} currency1={currencyB ?? undefined} size={24} />
      </RowBetween>

      <MainDataRow style={{ gap: '24px' }}>
        <PoolData>
          <AutoColumn gap="sm">
            <TYPE.body style={{ margin: 0 }}>{t('earnPage.totalStaked')}</TYPE.body>
            <TYPE.body fontSize={24} fontWeight={500}>
              {`$${stakingInfo?.totalStakedInUsd?.toFixed(0, { groupSeparator: ',' }) ?? '-'}`}
            </TYPE.body>
          </AutoColumn>
        </PoolData>
        <PoolData>
          <AutoColumn gap="sm">
            <TYPE.body style={{ margin: 0 }}>{t('earnPage.poolRate')}</TYPE.body>

            <TYPE.body fontSize={isSuperFarm ? 18 : 24} fontWeight={500}>
              {stakingInfo?.totalRewardRate
                ?.multiply((60 * 60 * 24 * 7).toString())
                ?.toFixed(0, { groupSeparator: ',' }) ?? '-'}
              {t('earnPage.rewardPerWeek', { symbol: 'PNG' })}
            </TYPE.body>

            {isSuperFarm && stakingInfo?.totalRewardRate && (
              <>
                {(extraRewardTokensAmount || []).map((reward, index) => {
                  const tokenMultiplier = stakingInfo?.rewardTokensMultiplier?.[index]
                  let totalRewardRate = getUserRewardRate(stakingInfo?.totalRewardRate, reward?.token, tokenMultiplier)

                  return (
                    <TYPE.body fontSize={18} fontWeight={500} key={index}>
                      {totalRewardRate?.multiply((60 * 60 * 24 * 7).toString())?.toFixed(0, { groupSeparator: ',' }) ??
                        '-'}

                      {t('earnPage.rewardPerWeek', { symbol: reward?.token.symbol })}
                    </TYPE.body>
                  )
                })}
              </>
            )}
          </AutoColumn>
        </PoolData>
      </MainDataRow>

      {version === '1' &&
      stakingInfo?.stakedAmount?.greaterThan(BIG_INT_ZERO) &&
      poolMap.hasOwnProperty(pairAddress) ? (
        <VoteCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>{t('earnPage.migrateTitle')}</TYPE.white>
              </RowBetween>
              <RowBetween style={{ marginBottom: '1rem' }}>
                <TYPE.white fontSize={14}>{t('earnPage.migrateDescription')}</TYPE.white>
              </RowBetween>
              <ButtonPrimary padding="8px" width={'fit-content'} as={Link} to={`/beta/migrate/1`}>
                {t('earnPage.migrate')}
              </ButtonPrimary>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </VoteCard>
      ) : null}

      {showAddLiquidityButton && (
        <VoteCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>{t('earnPage.step1')}</TYPE.white>
              </RowBetween>
              <RowBetween style={{ marginBottom: '1rem' }}>
                <TYPE.white fontSize={14}>
                  {t('earnPage.pglTokenRequired', { poolHandle: currencyA?.symbol + '-' + currencyB?.symbol })}
                </TYPE.white>
              </RowBetween>
              <ButtonPrimary
                padding="8px"
                width={'fit-content'}
                as={Link}
                to={`/add/${currencyA && currencyId(currencyA)}/${currencyB && currencyId(currencyB)}`}
              >
                {t('earnPage.addPoolLiquidity', { poolHandle: currencyA?.symbol + '-' + currencyB?.symbol })}
              </ButtonPrimary>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </VoteCard>
      )}

      {stakingInfo && (
        <>
          <StakingModal
            isOpen={showStakingModal}
            onDismiss={() => setShowStakingModal(false)}
            stakingInfo={stakingInfo}
            userLiquidityUnstaked={userLiquidityUnstaked}
            version={Number(version)}
          />
          <UnstakingModal
            isOpen={showUnstakingModal}
            onDismiss={() => setShowUnstakingModal(false)}
            stakingInfo={stakingInfo}
            version={Number(version)}
            extraRewardTokensAmount={extraRewardTokensAmount}
          />
          <ClaimRewardModal
            isOpen={showClaimRewardModal}
            onDismiss={() => setShowClaimRewardModal(false)}
            stakingInfo={stakingInfo}
            version={Number(version)}
            extraRewardTokensAmount={extraRewardTokensAmount}
          />
        </>
      )}

      <PositionInfo gap="lg" justify="center" dim={showAddLiquidityButton}>
        <BottomSection gap="lg" justify="center">
          <StyledDataCard disabled={disableTop} bgColor={backgroundColor} showBackground={!showAddLiquidityButton}>
            <CardSection>
              <CardBGImage desaturate />
              <CardNoise />
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white fontWeight={600}>{t('earnPage.liquidityDeposits')}</TYPE.white>
                </RowBetween>
                <RowBetween style={{ alignItems: 'baseline' }}>
                  <TYPE.white fontSize={36} fontWeight={600}>
                    {stakingInfo?.stakedAmount?.toSignificant(6) ?? '-'}
                  </TYPE.white>
                  <TYPE.white>
                    PGL {currencyA?.symbol}-{currencyB?.symbol}
                  </TYPE.white>
                </RowBetween>
              </AutoColumn>
            </CardSection>
          </StyledDataCard>
          {/* // copy */}

          <RewardCard
            stakedAmount={stakingInfo?.stakedAmount}
            earnedAmount={stakingInfo?.earnedAmount}
            rewardRate={stakingInfo?.rewardRate}
            setShowClaimRewardModal={() => setShowClaimRewardModal(true)}
            isOverlay={true}
            isSuperFarm={isSuperFarm}
          />

          {isSuperFarm && (
            <>
              {(extraRewardTokensAmount || []).map((reward, index) => {
                const userRewardRate = stakingInfo?.getHypotheticalRewardRate(
                  stakingInfo?.stakedAmount,
                  stakingInfo?.totalStakedAmount,
                  stakingInfo?.totalRewardRate
                )

                const tokenMultiplier = stakingInfo?.rewardTokensMultiplier?.[index]
                let rewardRate = getUserRewardRate(userRewardRate, reward?.token, tokenMultiplier)

                return (
                  <RewardCard
                    stakedAmount={stakingInfo?.stakedAmount}
                    earnedAmount={reward}
                    rewardRate={rewardRate}
                    setShowClaimRewardModal={() => setShowClaimRewardModal(true)}
                    currency={reward?.token}
                    isOverlay={false}
                    key={index}
                  />
                )
              })}
            </>
          )}
        </BottomSection>
        <TYPE.main style={{ textAlign: 'center' }} fontSize={14}>
          <span role="img" aria-label="wizard-icon" style={{ marginRight: '8px' }}>
            ⭐️
          </span>
          {t('earnPage.automagically')}
        </TYPE.main>

        {!showAddLiquidityButton && (
          <DataRow style={{ marginBottom: '1rem' }}>
            <ButtonPrimary padding="8px" borderRadius="8px" width="160px" onClick={handleDepositClick}>
              {stakingInfo?.stakedAmount?.greaterThan(BIG_INT_ZERO)
                ? t('earnPage.deposit')
                : t('earnPage.depositStakingTokens', { symbol: 'PGL' })}
            </ButtonPrimary>

            {isSuperFarm && stakingInfo?.earnedAmount?.greaterThan(BIG_INT_ZERO) && (
              <>
                <ButtonPrimary
                  padding="8px"
                  borderRadius="8px"
                  width="160px"
                  onClick={() => setShowClaimRewardModal(true)}
                >
                  {t('earnPage.claim')}
                </ButtonPrimary>
              </>
            )}

            {stakingInfo?.stakedAmount?.greaterThan(BIG_INT_ZERO) && (
              <>
                <ButtonPrimary
                  padding="8px"
                  borderRadius="8px"
                  width="160px"
                  onClick={() => setShowUnstakingModal(true)}
                >
                  Withdraw
                </ButtonPrimary>
              </>
            )}
          </DataRow>
        )}
        {!userLiquidityUnstaked ? null : userLiquidityUnstaked.equalTo('0') ? null : (
          <TYPE.main>
            {userLiquidityUnstaked.toSignificant(6)} {t('earnPage.stakingTokensAvailable', { symbol: 'PGL' })}
          </TYPE.main>
        )}
      </PositionInfo>
    </PageWrapper>
  )
}

export default Manage
