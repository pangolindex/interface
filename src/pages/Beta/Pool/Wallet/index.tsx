import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { TYPE } from 'src/theme'
import Card from 'src/components/Card'
import { useActiveWeb3React } from 'src/hooks'
import { useTranslation } from 'react-i18next'
import { PageWrapper, EmptyProposals, PanelWrapper, MobileContainer } from './styleds'
import WalletCard from './WalletCard'
import Scrollbars from 'react-custom-scrollbars'
import Loader from 'src/components/Loader'
import { useGetUserLP } from 'src/state/migrate/hooks'

import DropdownMenu from 'src/components/Beta/DropdownMenu'

interface Props {
  setMenu: (value: string) => void
  activeMenu: string
  menuItems: Array<{ label: string; value: string }>
}

const Wallet: React.FC<Props> = ({ setMenu, activeMenu, menuItems }) => {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const { v2IsLoading, allV2PairsWithLiquidity } = useGetUserLP()
  // fetch the user's balances of all tracked V2 LP tokens

  const { t } = useTranslation()

  return (
    <PageWrapper>
      <MobileContainer>
        <DropdownMenu
          options={menuItems}
          value={activeMenu}
          onSelect={value => {
            setMenu(value)
          }}
        />
      </MobileContainer>

      {!account ? (
        <Card padding="40px">
          <TYPE.body color={theme.text3} textAlign="center">
            {t('pool.connectWalletToView')}
          </TYPE.body>
        </Card>
      ) : v2IsLoading ? (
        <Loader style={{ margin: 'auto' }} stroke={theme.primary} />
      ) : allV2PairsWithLiquidity?.length > 0 ? (
        <>
          <Scrollbars>
            <PanelWrapper>
              {allV2PairsWithLiquidity.map(v2Pair => (
                <WalletCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
              ))}
            </PanelWrapper>
          </Scrollbars>
        </>
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

export default Wallet
