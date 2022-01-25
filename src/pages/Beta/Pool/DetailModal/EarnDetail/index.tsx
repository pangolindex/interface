import React from 'react'
import { Wrapper } from './styleds'
import { Text, Box, Button } from '@pangolindex/components'
import { useTranslation } from 'react-i18next'
import Stat from 'src/components/Stat'
import { StakingInfo } from 'src/state/stake/hooks'
import { RowBetween } from 'src/components/Row'
import { BIG_INT_ZERO } from 'src/constants'

export interface EarnDetailProps {
  stakingInfo: StakingInfo
  onOpenClaimModal: () => void
  onOpenWithdrawModal: () => void
}

const EarnDetail = ({ stakingInfo, onOpenClaimModal, onOpenWithdrawModal }: EarnDetailProps) => {
  const { t } = useTranslation()

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
