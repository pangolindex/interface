import React from 'react'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import { DetailsContainer } from './styled'
import { Box, CoinDescription } from '@pangolindex/components'
import StatDetails from '../StatDetail'
import { useTranslation } from 'react-i18next';

type Props = {
  stakingInfo: SingleSideStakingInfo
}

const Details: React.FC<Props> = ({ stakingInfo }) => {
  const { t } = useTranslation();
  const amountInPNG = stakingInfo?.totalStakedInPng
  const isStaking = stakingInfo?.stakedAmount?.greaterThan('0')
  const bothCurrencySame = stakingInfo?.rewardToken?.equals(stakingInfo?.totalStakedAmount?.token)

  return (
    <>
      <DetailsContainer>
        <Box pb="20px">
          <StatDetails
            title={t('pool.totalStake')}
            amountInPNG={amountInPNG}
            currency0={stakingInfo?.totalStakedAmount?.token}
          />
        </Box>
        {isStaking && (
          <Box pb="20px">
            <StatDetails
              title={t('pool.yourStake')}
              amountInPNG={stakingInfo?.stakedAmount}
              currency0={stakingInfo?.stakedAmount?.token}
            />
          </Box>
        )}
        <Box pb="20px">
          <CoinDescription coin={stakingInfo?.totalStakedAmount?.token} />
        </Box>
        {!bothCurrencySame && (
          <Box pb="20px">
            <CoinDescription coin={stakingInfo?.rewardToken} />
          </Box>
        )}
      </DetailsContainer>
    </>
  )
}

export default Details
