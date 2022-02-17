import React from 'react'
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

export interface EarnDetailProps {
  stakingInfo: StakingInfo
  onOpenClaimModal: () => void
  onOpenWithdrawModal: () => void
}

const EarnDetail = ({ stakingInfo, onOpenClaimModal, onOpenWithdrawModal }: EarnDetailProps) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const { rewardTokensAmount } = useMinichefPendingRewards(stakingInfo)

  let isSuperFarm = (rewardTokensAmount || [])?.length > 0

  const png = PNG[chainId || ChainId.AVALANCHE] // add PNG as default reward
  return (
    <Wrapper>
      <Text color="text1" fontSize={24} fontWeight={500}>
        {t('dashboardPage.earned')}
      </Text>
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

      <Box mt={10}>
        <RowBetween>
          <Box mr="5px" width="100%">
            <Button variant={'primary'} onClick={() => onOpenWithdrawModal()}>
              {t('earn.withdraw')}
            </Button>
          </Box>
          {Boolean(stakingInfo?.earnedAmount?.greaterThan(BIG_INT_ZERO)) && (
            <Box width="100%">
              <Button variant="primary" onClick={() => onOpenClaimModal()}>
                {t('earnPage.claim')}
              </Button>
            </Box>
          )}
        </RowBetween>
      </Box>
    </Wrapper>
  )
}
export default EarnDetail
