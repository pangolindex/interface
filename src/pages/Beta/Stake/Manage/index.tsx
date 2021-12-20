import React from 'react'
import { useParams } from 'react-router-dom'
import { Text } from '@pangolindex/components'
import { ChainId, JSBI } from '@pangolindex/sdk'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardColumn, CardStats, CardButtons, DetailButton, StakeButton } from './styleds'

import CurrencyLogo from 'src/components/CurrencyLogo'
// import { useWalletModalToggle } from 'src/state/application/hooks'
import { useSingleSideStakingInfo } from 'src/state/stake/hooks'
// import { useTokenBalance } from 'src/state/wallet/hooks'
import { useActiveWeb3React } from 'src/hooks'
import { useCurrency } from 'src/hooks/Tokens'
// import { useColor } from 'src/hooks/useColor'
// import usePrevious from 'src/hooks/usePrevious'
import { wrappedCurrency } from 'src/utils/wrappedCurrency'
import { PNG } from 'src/constants'
import TokenAmount from '../TokenAmount'

export interface PoolManageProps {
  rewardCurrencyId: string
  version: string
}

const PoolManage = () => {
  const params = useParams<PoolManageProps>()

  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const rewardCurrency = useCurrency(params.rewardCurrencyId)
  const rewardToken = wrappedCurrency(rewardCurrency ?? undefined, chainId)
  const stakingInfo = useSingleSideStakingInfo(Number(params.version), rewardToken)?.[0]
  const png = PNG[chainId ? chainId : ChainId.AVALANCHE]

  // const backgroundColorStakingToken = useColor(png)

  // detect existing unstaked position to show purchase button if none found
  // const userPngUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token)
  // const showGetPngButton = useMemo(() => {
  //   if (!userPngUnstaked || !stakingInfo) return true
  //   return Boolean(stakingInfo?.stakedAmount?.equalTo('0') && userPngUnstaked?.equalTo('0'))
  // }, [stakingInfo, userPngUnstaked])

  // const [showStakingModal, setShowStakingModal] = useState(false)
  // const [showUnstakingModal, setShowUnstakingModal] = useState(false)
  // const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  // const countUpAmount = stakingInfo?.earnedAmount?.toFixed(6) ?? '0'
  // const countUpAmountPrevious = usePrevious(countUpAmount) ?? '0'

  // const toggleWalletModal = useWalletModalToggle()

  // const handleStakeClick = useCallback(() => {
  //   if (account) {
  //     setShowStakingModal(true)
  //   } else {
  //     toggleWalletModal()
  //   }
  // }, [account, toggleWalletModal])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <Text fontSize={32} fontWeight={600} lineHeight="48px" color="text1" style={{ padding: '20px' }}>
        {t('earnPage.pngStaking')}
      </Text>
      <Card>
        <CardHeader>
          <CurrencyLogo size="40px" currency={png} />
          <CurrencyLogo size="40px" currency={stakingInfo.rewardToken} />
        </CardHeader>
        <CardStats>
          <CardColumn width="40%">
            <Text fontSize={16} fontWeight={600} lineHeight="24px" color="text1">
              {t('stakePage.totalStaked')}
            </Text>
            <Text fontSize={24} fontWeight={400} lineHeight="36px" color="text1">
              {`${stakingInfo.totalStakedInPng.toSignificant(4, { groupSeparator: ',' }) ?? '-'} PNG`}
            </Text>
          </CardColumn>
          <CardColumn>
            <Text fontSize={16} fontWeight={600} lineHeight="24px" color="text1">
              {t('stakePage.apr')}
            </Text>
            <Text fontSize={24} fontWeight={400} lineHeight="36px" color="text1">
              {JSBI.greaterThan(stakingInfo.apr, JSBI.BigInt(0)) && !stakingInfo.isPeriodFinished
                ? `${stakingInfo.apr.toLocaleString()}%`
                : ' - '}
            </Text>
          </CardColumn>
        </CardStats>
        <TokenAmount label="Your staked PNG" symbol="PNG" amount={8849.11} />
        <TokenAmount label="Your unclaimed ORBS" symbol="ORBS" amount={8849.11} cycle="Week" cycleReward={526.2} />
        <CardButtons>
          <StakeButton variant="primary">{t('earnPage.stake', { symbol: 'PNG' })}</StakeButton>
          <DetailButton variant="outline">{t('earnPage.unstake')}</DetailButton>
        </CardButtons>
      </Card>
    </div>
  )
}
export default PoolManage
