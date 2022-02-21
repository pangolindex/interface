import { Button, Text } from '@0xkilo/components'
import { ChainId, JSBI } from '@antiyro/sdk'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PNG, ZERO_ADDRESS } from 'src/constants'
import { useActiveWeb3React } from 'src/hooks'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import { useTokenBalance } from 'src/state/wallet/hooks'
import DepositDrawer from '../DepositDrawer'
import UnstakeDrawer from '../UnstakeDrawer'
import { Root, StakedAmount, TokenSymbol, Buttons, UnstakeButton } from './styled'
import { BETA_MENU_LINK } from 'src/constants'

type Props = {
  stakingInfo: SingleSideStakingInfo
}

const StakeWidget: React.FC<Props> = ({ stakingInfo }) => {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const [isUnstakeDrawerVisible, setShowUnstakeDrawer] = useState(false)
  const [isDepositDrawerVisible, setShowDepositDrawer] = useState(false)

  const png = PNG[chainId ? chainId : ChainId.AVALANCHE]
  // detect existing unstaked position to show purchase button if none found
  const userPngUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token)

  const stakeToken = stakingInfo?.stakedAmount?.token?.symbol

  return (
    <Root>
      <Text color="text10" fontSize={20} fontWeight={500} mb={20}>
        Stake PNG
      </Text>

      {/* show already staked amount */}
      <Text color="text10" fontSize={14}>
        {t('earnPage.yourStakedToken', { symbol: stakeToken })}
      </Text>
      <StakedAmount>
        <span>{stakingInfo?.stakedAmount?.toSignificant(6, { groupSeparator: ',' })}</span>
        <TokenSymbol>{stakeToken}</TokenSymbol>
      </StakedAmount>

      {/* show png unstaked balance */}
      <Text color="text8" fontSize={12} mt={15} textAlign="center">
        {userPngUnstaked?.toSignificant(6, { groupSeparator: ',' }) || '0.00'}{' '}
        {t('earnPage.stakingTokensAvailable', { symbol: stakeToken })}
      </Text>

      <Buttons>
        {/* show staked or get png button */}
        {userPngUnstaked?.greaterThan('0') ? (
          <Button padding="15px 18px" variant="primary" onClick={() => setShowDepositDrawer(true)}>
            {stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0))
              ? t('earnPage.stake')
              : t('earnPage.stakeStakingTokens', { symbol: stakeToken })}
          </Button>
        ) : (
          <Button
            padding="15px 18px"
            variant="primary"
            as="a"
            href={`/#${BETA_MENU_LINK.swap}?inputCurrency=${ZERO_ADDRESS}&outputCurrency=${png.address}`}
          >
            {t('earnPage.getToken', { symbol: stakeToken })}
          </Button>
        )}

        {/* show unstak button */}
        {stakingInfo?.stakedAmount?.greaterThan('0') && (
          <UnstakeButton variant="outline" onClick={() => setShowUnstakeDrawer(true)}>
            {t('earnPage.unstake')}
          </UnstakeButton>
        )}
      </Buttons>

      {/* Deposit Drawer */}
      <DepositDrawer
        isOpen={isDepositDrawerVisible}
        onClose={() => {
          setShowDepositDrawer(false)
        }}
        stakingInfo={stakingInfo}
      />

      {/* Unstake Drawer */}
      <UnstakeDrawer
        isOpen={isUnstakeDrawerVisible}
        onClose={() => {
          setShowUnstakeDrawer(false)
        }}
        stakingInfo={stakingInfo}
      />
    </Root>
  )
}

export default StakeWidget
