import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { TYPE } from 'src/theme'
import Card from 'src/components/Card'
import { useActiveWeb3React } from 'src/hooks'
import { useTranslation } from 'react-i18next'
import { PageWrapper, EmptyProposals, PanelWrapper } from './styleds'
import WalletCard from './WalletCard'
import Scrollbars from 'react-custom-scrollbars'
import Loader from 'src/components/Loader'
import { useGetUserLP } from 'src/state/migrate/hooks'

export default function Wallet() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  let { v2IsLoading, allV2PairsWithLiquidity } = useGetUserLP()
  // fetch the user's balances of all tracked V2 LP tokens

  const { t } = useTranslation()

  return (
    <PageWrapper>
      {!account ? (
        <Card padding="40px">
          <TYPE.body color={theme.text3} textAlign="center">
            {t('pool.connectWalletToView')}
          </TYPE.body>
        </Card>
      ) : v2IsLoading ? (
        <Loader style={{ margin: 'auto' }} />
      ) : allV2PairsWithLiquidity?.length > 0 ? (
        <Scrollbars>
          <PanelWrapper>
            {allV2PairsWithLiquidity.map(v2Pair => (
              <WalletCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
            ))}
          </PanelWrapper>
        </Scrollbars>
      ) : (
        <EmptyProposals>
          <TYPE.body color={theme.text3} textAlign="center">
            {t('pool.noLiquidity')}
          </TYPE.body>
        </EmptyProposals>
      )}
    </PageWrapper>
  )
}
