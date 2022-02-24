import React, { useContext, useState } from 'react'
import { ThemeContext } from 'styled-components'
import { Token } from '@pangolindex/sdk'
import { TYPE } from 'src/theme'
import Card from 'src/components/Card'
import { useActiveWeb3React } from 'src/hooks'
import { useTranslation } from 'react-i18next'
import { PageWrapper, EmptyProposals, PanelWrapper, MobileContainer } from './styleds'
import WalletCard from './WalletCard'
import Scrollbars from 'react-custom-scrollbars'
import Loader from 'src/components/Loader'
import { useGetUserLP } from 'src/state/migrate/hooks'
import { useAddLiquiditynModalToggle, useModalOpen, useRemoveLiquiditynModalToggle } from 'src/state/application/hooks'
import { ApplicationModal } from 'src/state/application/actions'
import AddLiquidityModal from '../AddLiquidityModal'
import RemoveLiquidityModal from '../RemoveLiquidityModal'
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

  const [clickedLpTokens, setClickedLpTokens] = useState([] as Token[])

  const toggleAddLiquidityModal = useAddLiquiditynModalToggle()
  const addLiquidityModalOpen = useModalOpen(ApplicationModal.ADD_LIQUIDITY)

  const toggleRemoveLiquidityModal = useRemoveLiquiditynModalToggle()
  const removeLiquidityModalOpen = useModalOpen(ApplicationModal.REMOVE_LIQUIDITY)

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
                <WalletCard
                  key={v2Pair.liquidityToken.address}
                  pair={v2Pair}
                  onClickAddLiquidity={() => {
                    setClickedLpTokens([v2Pair?.token0, v2Pair?.token1])
                    toggleAddLiquidityModal()
                  }}
                  onClickRemoveLiquidity={() => {
                    setClickedLpTokens([v2Pair?.token0, v2Pair?.token1])
                    toggleRemoveLiquidityModal()
                  }}
                />
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

      {addLiquidityModalOpen && <AddLiquidityModal clickedLpTokens={clickedLpTokens} />}
      {removeLiquidityModalOpen && <RemoveLiquidityModal clickedLpTokens={clickedLpTokens} />}
    </PageWrapper>
  )
}

export default Wallet
