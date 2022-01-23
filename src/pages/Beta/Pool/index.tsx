// @ts-nocheck
import React, { useState } from 'react'
import { Box } from '@pangolindex/components'
import { PageWrapper, GridContainer } from './styleds'
import Sidebar from './Sidebar'
import AllPoolList from './AllPoolList'
import Wallet from './Wallet'
import { MenuType } from './Sidebar'
import Migration from './Migration'

export enum PoolType {
  own = 'own',
  all = 'all'
}

const PoolUI = () => {
  const [activeMenu, setMenu] = useState<string>(MenuType.allPoolV2)

  return (
    <PageWrapper>
      <GridContainer>
        <Box display="flex" height="100%">
          <Sidebar activeMenu={activeMenu} setMenu={(value: string) => setMenu(value)} />
          {(activeMenu === MenuType.allPoolV1 ||
            activeMenu === MenuType.allPoolV2 ||
            activeMenu === MenuType.yourPoolV2 ||
            activeMenu === MenuType.yourPoolV1) && (
            <AllPoolList
              type={
                activeMenu === MenuType.allPoolV1 || activeMenu === MenuType.allPoolV2 ? PoolType.all : PoolType.own
              }
              version={activeMenu === MenuType.allPoolV1 || activeMenu === MenuType.yourPoolV1 ? 1 : 2}
            />
          )}
          {activeMenu === MenuType.yourWallet && <Wallet />}
        </Box>

        <Box>
          <Migration />
        </Box>
      </GridContainer>
    </PageWrapper>
  )
}
export default PoolUI
