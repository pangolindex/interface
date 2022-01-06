import React from 'react'
import { Pair } from '@pangolindex/sdk'
import { Panel, Divider, ActionButon, InnerWrapper, DetailButton } from './styleds'
import Stat from 'src/components/Stat'
import { useTokenBalance } from 'src/state/wallet/hooks'
import { Text, Box, DoubleCurrencyLogo } from '@pangolindex/components'
import { AutoRow } from 'src/components/Row'
import { useTranslation } from 'react-i18next'
import useUSDCPrice from 'src/utils/useUSDCPrice'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import { useActiveWeb3React } from 'src/hooks'

export interface WalletCardProps {
  pair: Pair
}

const WalletCard = ({ pair }: WalletCardProps) => {
  const { t } = useTranslation()

  const { account } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const currency0Price = useUSDCPrice(currency0)
  const multipyAmount = currency0Price ? Number(currency0Price.toFixed()) * 2 : 0

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)

  return (
    <Panel>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Text color="text1" fontSize={24} fontWeight={500}>
            {currency0.symbol}-{currency1.symbol}
          </Text>
        </Box>

        <DoubleCurrencyLogo size={55} currency0={currency0} currency1={currency1} />
      </Box>
      <Divider />

      <AutoRow gap="20px">
        <Stat
          title={t('pool.yourLiquidity')}
          stat={`${multipyAmount ? `$${multipyAmount?.toFixed(4)}` : '-'}`}
          titlePosition="top"
        />

        <Stat title={`Your PGL`} stat={userPoolBalance ? userPoolBalance.toSignificant(4) : '-'} titlePosition="top" />
      </AutoRow>

      <InnerWrapper>
        <Box>
          <DetailButton variant="plain" onClick={() => {}} color="text1" height="45px">
            {t('positionCard.add')}
          </DetailButton>
        </Box>
        <Box>
          <ActionButon variant="plain" onClick={() => {}} backgroundColor="bg2" color="text1" height="45px">
            {t('positionCard.remove')}
          </ActionButon>
        </Box>
      </InnerWrapper>
    </Panel>
  )
}

export default WalletCard
