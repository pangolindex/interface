import React from 'react'
import { Pair, ChainId } from '@pangolindex/sdk'
import { Panel, Divider, ActionButon, InnerWrapper, DetailButton } from './styleds'
import Stat from 'src/components/Stat'
import { Text, Box, DoubleCurrencyLogo } from '@pangolindex/components'
import { useTranslation } from 'react-i18next'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import { useGetPoolDollerWorth } from 'src/state/stake/hooks'
import { useActiveWeb3React } from 'src/hooks'
import { useTokenBalance } from 'src/state/wallet/hooks'

export interface WalletCardProps {
  pair: Pair
  onClickAddLiquidity: () => void
  onClickRemoveLiquidity: () => void
}

const WalletCard = ({ pair, onClickAddLiquidity, onClickRemoveLiquidity }: WalletCardProps) => {
  const { t } = useTranslation()

  const { account, chainId } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair.token0, chainId || ChainId.AVALANCHE)
  const currency1 = unwrappedToken(pair.token1, chainId || ChainId.AVALANCHE)

  const userPgl = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const { liquidityInUSD } = useGetPoolDollerWorth(pair)

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

      <InnerWrapper>
        <Stat
          title={t('pool.yourLiquidity')}
          stat={`${liquidityInUSD ? `$${liquidityInUSD?.toFixed(4)}` : '-'}`}
          titlePosition="top"
          titleFontSize={16}
          statFontSize={24}
        />

        <Stat
          title={t('positionCard.poolTokens')}
          stat={userPgl ? userPgl.toSignificant(4) : '-'}
          titlePosition="top"
          titleFontSize={16}
          statFontSize={24}
        />
      </InnerWrapper>

      <InnerWrapper>
        <Box>
          <DetailButton variant="plain" onClick={() => onClickAddLiquidity()} color="text1" height="45px">
            {t('positionCard.add')}
          </DetailButton>
        </Box>
        <Box>
          <ActionButon
            variant="plain"
            onClick={() => onClickRemoveLiquidity()}
            backgroundColor="bg2"
            color="text1"
            height="45px"
          >
            {t('positionCard.remove')}
          </ActionButon>
        </Box>
      </InnerWrapper>
    </Panel>
  )
}

export default WalletCard
