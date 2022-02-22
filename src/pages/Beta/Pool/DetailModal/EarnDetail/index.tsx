import React, { useState } from 'react'
import { Wrapper, InnerWrapper } from './styleds'
import { TokenAmount, ChainId } from '@pangolindex/sdk'
import { Text, Box, Button } from '@pangolindex/components'
import { useTranslation } from 'react-i18next'
import Stat from 'src/components/Stat'
import { StakingInfo } from 'src/state/stake/hooks'
import { RowBetween } from 'src/components/Row'
import { BIG_INT_ZERO } from 'src/constants'
import { useMinichefPendingRewards } from 'src/state/stake/hooks'
import { PNG } from 'src/constants'
import { useActiveWeb3React } from 'src/hooks'
import ClaimDrawer from '../../ClaimDrawer'
import WithdrawDrawer from '../../WithdrawDrawer'

export interface EarnDetailProps {
  stakingInfo: StakingInfo
  version: number
}

const EarnDetail = ({ stakingInfo, version }: EarnDetailProps) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const [isClaimDrawerVisible, setShowClaimDrawer] = useState(false)
  const [isWithdrawDrawerVisible, setShowWithdrawDrawer] = useState(false)

  const { rewardTokensAmount } = useMinichefPendingRewards(stakingInfo)

  let isSuperFarm = (rewardTokensAmount || [])?.length > 0

  const png = PNG[chainId || ChainId.AVALANCHE] // add PNG as default reward
  return (
    <Wrapper>
      <Text color="text1" fontSize={24} fontWeight={500}>
        {t('dashboardPage.earned')}
      </Text>
      <Box flex="1">
        <InnerWrapper>
          <Box>
            <Stat
              title={t('dashboardPage.earned_weeklyIncome')}
              stat={`${stakingInfo?.rewardRatePerWeek?.toSignificant(4, { groupSeparator: ',' }) ?? '-'}`}
              titlePosition="top"
              titleFontSize={14}
              statFontSize={20}
              titleColor="text2"
              currency={png}
            />
          </Box>

          <Box>
            <Stat
              title={t('dashboardPage.earned_totalEarned')}
              stat={`${stakingInfo?.earnedAmount?.toFixed(6) ?? '0'}`}
              titlePosition="top"
              titleFontSize={14}
              statFontSize={20}
              titleColor="text2"
              currency={png}
            />
          </Box>
        </InnerWrapper>

        {isSuperFarm && (
          <>
            {(rewardTokensAmount || []).map((reward, index) => {
              const tokenMultiplier = stakingInfo?.rewardTokensMultiplier?.[index]

              const extraTokenWeeklyRewardRate = stakingInfo?.getExtraTokensWeeklyRewardRate?.(
                stakingInfo?.rewardRatePerWeek,
                reward?.token,
                tokenMultiplier
              ) as TokenAmount

              return (
                <InnerWrapper key={index}>
                  <Box>
                    <Stat
                      stat={`${extraTokenWeeklyRewardRate?.toSignificant(4, { groupSeparator: ',' }) ?? '-'} `}
                      statFontSize={20}
                      currency={reward?.token}
                    />
                  </Box>

                  <Box>
                    <Stat stat={`${reward?.toFixed(6) ?? '0'}`} statFontSize={20} currency={reward?.token} />
                  </Box>
                </InnerWrapper>
              )
            })}
          </>
        )}
      </Box>

      <Box mt={10}>
        <RowBetween>
          <Box mr="5px" width="100%">
            <Button variant={'primary'} onClick={() => setShowWithdrawDrawer(true)}>
              {t('earn.withdraw')}
            </Button>
          </Box>
          {Boolean(stakingInfo?.earnedAmount?.greaterThan(BIG_INT_ZERO)) && (
            <Box width="100%">
              <Button variant="primary" onClick={() => setShowClaimDrawer(true)}>
                {t('earnPage.claim')}
              </Button>
            </Box>
          )}
        </RowBetween>
      </Box>

      <ClaimDrawer
        isOpen={isClaimDrawerVisible}
        onClose={() => {
          setShowClaimDrawer(false)
        }}
        stakingInfo={stakingInfo}
        version={version}
      />
      <WithdrawDrawer
        isOpen={isWithdrawDrawerVisible}
        onClose={() => {
          setShowWithdrawDrawer(false)
        }}
        stakingInfo={stakingInfo}
        version={version}
      />
    </Wrapper>
  )
}
export default EarnDetail
