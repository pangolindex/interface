import React, { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Text } from '@pangolindex/components'
import { ChainId, JSBI } from '@pangolindex/sdk'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardColumn, CardStats, CardButtons, OutlineButton, PrimaryButton } from './styleds'

import CurrencyLogo from 'src/components/CurrencyLogo'
import { useWalletModalToggle } from 'src/state/application/hooks'
import { useSingleSideStakingInfo } from 'src/state/stake/hooks'
import { useTokenBalance } from 'src/state/wallet/hooks'
import { useActiveWeb3React } from 'src/hooks'
import { useCurrency } from 'src/hooks/Tokens'
import usePrevious from 'src/hooks/usePrevious'
import { CountUp } from 'use-count-up'
import StakingModalSingleSide from 'src/components/earn/StakingModalSingleSide'
import UnstakingModalSingleSide from 'src/components/earn/UnstakingModalSingleSide'
import ClaimRewardModalSingleSide from 'src/components/earn/ClaimRewardModalSingleSide'
import { wrappedCurrency } from 'src/utils/wrappedCurrency'
import { PNG, ZERO_ADDRESS } from 'src/constants'
import { StyledInternalLink } from 'src/theme'
import TokenAmount from '../TokenAmount'
import Loader from 'src/components/Loader'

export interface PoolManageProps {
  rewardCurrencyId: string
  version: string
}

const PoolManage = () => {
  const params = useParams<PoolManageProps>()

  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const rewardCurrency = useCurrency(params.rewardCurrencyId)
  const rewardToken = wrappedCurrency(rewardCurrency ?? undefined, chainId)
  const stakingInfo = useSingleSideStakingInfo(Number(params.version), rewardToken)?.[0]
  const png = PNG[chainId ? chainId : ChainId.AVALANCHE]

  // const backgroundColorStakingToken = useColor(png)

  // detect existing unstaked position to show purchase button if none found
  const userPngUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token)
  // const showGetPngButton = useMemo(() => {
  //   if (!userPngUnstaked || !stakingInfo) return true
  //   return Boolean(stakingInfo?.stakedAmount?.equalTo('0') && userPngUnstaked?.equalTo('0'))
  // }, [stakingInfo, userPngUnstaked])

  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  const countUpAmount = stakingInfo?.earnedAmount?.toFixed(6) ?? '0'
  const countUpAmountPrevious = usePrevious(countUpAmount) ?? '0'

  const toggleWalletModal = useWalletModalToggle()

  const handleStakeClick = useCallback(() => {
    if (account) {
      setShowStakingModal(true)
    } else {
      toggleWalletModal()
    }
  }, [account, toggleWalletModal])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <Text fontSize={32} fontWeight={600} lineHeight="48px" color="text1" style={{ padding: '20px' }}>
        {t('earnPage.pngStaking')}
      </Text>
      <Card>
        <CardHeader>
          <CurrencyLogo size="40px" currency={png} />
          <CurrencyLogo size="40px" currency={stakingInfo?.rewardToken} />
        </CardHeader>
        <CardStats>
          <CardColumn width="40%">
            <Text fontSize={16} fontWeight={600} lineHeight="24px" color="text1">
              {t('stakePage.totalStaked')}
            </Text>
            <Text fontSize={24} fontWeight={400} lineHeight="36px" color="text1">
              {stakingInfo ? (
                `${stakingInfo.totalStakedInPng?.toSignificant(4, { groupSeparator: ',' }) ?? '-'} PNG`
              ) : (
                <Loader />
              )}
            </Text>
          </CardColumn>
          <CardColumn>
            <Text fontSize={16} fontWeight={600} lineHeight="24px" color="text1">
              {t('stakePage.apr')}
            </Text>
            <Text fontSize={24} fontWeight={400} lineHeight="36px" color="text1">
              {stakingInfo ? (
                JSBI.greaterThan(stakingInfo.apr, JSBI.BigInt(0)) && !stakingInfo.isPeriodFinished ? (
                  `${stakingInfo.apr.toLocaleString()}%`
                ) : (
                  ' - '
                )
              ) : (
                <Loader />
              )}
            </Text>
          </CardColumn>
        </CardStats>
        <TokenAmount label="Your staked" symbol="PNG" amount={stakingInfo?.stakedAmount?.toSignificant(6) ?? '-'} />
        <TokenAmount
          label="Your unclaimed"
          symbol={stakingInfo?.rewardToken?.symbol}
          cycle="Week"
          cycleReward={
            stakingInfo?.rewardRate
              ?.multiply((60 * 60 * 24 * 7).toString())
              ?.toSignificant(4, { groupSeparator: ',' }) ?? '-'
          }
        >
          <CountUp
            key={countUpAmount}
            isCounting
            decimalPlaces={4}
            start={parseFloat(countUpAmountPrevious)}
            end={parseFloat(countUpAmount)}
            thousandsSeparator={','}
            duration={1}
          />
        </TokenAmount>
        <CardButtons>
          {userPngUnstaked?.greaterThan('0') ? (
            <>
              <PrimaryButton variant="primary" onClick={handleStakeClick}>
                {stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0))
                  ? t('earnPage.stake')
                  : t('earnPage.stakeStakingTokens', { symbol: 'PNG' })}
              </PrimaryButton>
            </>
          ) : (
            <StyledInternalLink
              to={`/swap?inputCurrency=${ZERO_ADDRESS}&outputCurrency=${png.address}`}
              style={{ width: '100%', textDecoration: 'none' }}
            >
              <PrimaryButton variant="primary">{t('earnPage.getToken', { symbol: 'PNG' })}</PrimaryButton>
            </StyledInternalLink>
          )}

          {stakingInfo?.stakedAmount?.greaterThan('0') && (
            <OutlineButton variant="outline" onClick={() => setShowUnstakingModal(true)}>
              {t('earnPage.unstake')}
            </OutlineButton>
          )}
        </CardButtons>

        {userPngUnstaked?.greaterThan('0') && (
          <Text
            fontSize={18}
            fontWeight={400}
            lineHeight="27px"
            color="text1"
            style={{ marginTop: '30px', textAlign: 'center' }}
          >
            {userPngUnstaked.toSignificant(6)} {t('earnPage.stakingTokensAvailable', { symbol: 'PNG' })}
          </Text>
        )}
      </Card>
      {stakingInfo && (
        <>
          <StakingModalSingleSide
            isOpen={showStakingModal}
            onDismiss={() => setShowStakingModal(false)}
            stakingInfo={stakingInfo}
            userLiquidityUnstaked={userPngUnstaked}
          />
          <UnstakingModalSingleSide
            isOpen={showUnstakingModal}
            onDismiss={() => setShowUnstakingModal(false)}
            stakingInfo={stakingInfo}
          />
          <ClaimRewardModalSingleSide
            isOpen={showClaimRewardModal}
            onDismiss={() => setShowClaimRewardModal(false)}
            stakingInfo={stakingInfo}
          />
        </>
      )}
    </div>
  )
}
export default PoolManage
