import React, { useState, useCallback } from 'react'
import { Wrapper } from './styleds'
import { Text, Box, Button } from '@pangolindex/components'
import { useTranslation } from 'react-i18next'
import Stat from 'src/components/Stat'
import { StakingInfo } from 'src/state/stake/hooks'
import { RowBetween } from 'src/components/Row'
import ClaimRewardDrawer from '../ClaimRewardDrawer'
import WithdrawDrawer from '../WithdrawDrawer'

export interface EarnDetailProps {
  stakingInfo: StakingInfo
  version: number
}

const EarnDetail = ({ stakingInfo, version }: EarnDetailProps) => {
  const { t } = useTranslation()
  const [isClaimRewardDrawerOpen, setIsClaimRewardDrawerOpen] = useState(false)
  const [isWithdrawDrawerOpen, setIsWithdrawDrawerOpen] = useState(false)

  const handleClaimRewardDrawerClose = useCallback(() => {
    setIsClaimRewardDrawerOpen(false)
  }, [setIsClaimRewardDrawerOpen])

  const handleWithdrawDrawerClose = useCallback(() => {
    setIsWithdrawDrawerOpen(false)
  }, [setIsWithdrawDrawerOpen])

  return (
    <Wrapper>
      <Text color="text1" fontSize={24} fontWeight={500}>
        {t('dashboardPage.earned')}
      </Text>

      <Box>
        <Stat
          title={t('dashboardPage.earned_dailyIncome')}
          stat={`${stakingInfo?.rewardRate
            ?.multiply((60 * 60 * 24).toString())
            ?.toSignificant(4, { groupSeparator: ',' }) ?? '-'} PNG`}
          titlePosition="top"
          titleFontSize={14}
          statFontSize={24}
          titleColor="text2"
        />
      </Box>

      <Box mt={10}>
        <Stat
          title={t('dashboardPage.earned_totalEarned')}
          stat={`${stakingInfo?.earnedAmount?.toFixed(6) ?? '0'}`}
          titlePosition="top"
          titleFontSize={14}
          statFontSize={24}
          titleColor="text2"
        />
      </Box>

      <Box mt={10}>
        <RowBetween>
          <Box mr="5px" width="100%">
            <Button variant={'primary'} onClick={() => setIsWithdrawDrawerOpen(true)}>
              {t('earn.withdraw')}
            </Button>
          </Box>

          <Box width="100%">
            <Button variant="primary" onClick={() => setIsClaimRewardDrawerOpen(true)}>
              {t('earnPage.claim')}
            </Button>
          </Box>
        </RowBetween>
      </Box>

      <ClaimRewardDrawer
        isOpen={isClaimRewardDrawerOpen}
        onClose={handleClaimRewardDrawerClose}
        version={version}
        stakingInfo={stakingInfo}
      />

      <WithdrawDrawer
        isOpen={isWithdrawDrawerOpen}
        onClose={handleWithdrawDrawerClose}
        version={version}
        stakingInfo={stakingInfo}
      />
    </Wrapper>
  )
}
export default EarnDetail
