import React, { useState } from 'react'
import { Box } from '@pangolindex/components'
import { PageWrapper, GridContainer } from './styleds'
import Sidebar from './Sidebar'
import AllPoolList from './AllPoolList'
import { MenuType } from './Sidebar'

const PoolUI = () => {
  const [activeMenu, setMenu] = useState<string>(MenuType.poolV2)

  return (
    <PageWrapper>
      <GridContainer>
        <Box display="flex">
          <Sidebar activeMenu={activeMenu} setMenu={(value: string) => setMenu(value)} />
          {(activeMenu === MenuType.poolV1 || activeMenu === MenuType.poolV2) && (
            <AllPoolList version={activeMenu === MenuType.poolV1 ? 1 : 2} />
          )}
        </Box>

        <div></div>
      </GridContainer>
    </PageWrapper>
  )
}
export default PoolUI
