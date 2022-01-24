// @ts-nocheck
import React, { useState } from 'react'
import { Box } from '@pangolindex/components'
import { PageWrapper, GridContainer, ExternalLink } from './styleds'
import Sidebar from './Sidebar'
import AllPoolList from './AllPoolList'
import Wallet from './Wallet'
import { MenuType } from './Sidebar'
import Migration from './Migration'
import { useTranslation } from 'react-i18next'

export enum PoolType {
  own = 'own',
  all = 'all'
}

const PoolUI = () => {
  const [activeMenu, setMenu] = useState<string>(MenuType.allPoolV2)
  const { t } = useTranslation()

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
          <ExternalLink
            href="https://app.nexusmutual.io/cover/buy/get-quote?address=0xefa94DE7a4656D787667C749f7E1223D71E9FD88"
            target="_blank"
          >
            {t('earnPage.getCoverNexusMutual')}
          </ExternalLink>
          <ExternalLink
            href="https://app.insurace.io/Insurance/BuyCovers?referrer=565928487188065888397039055593264600345483712698"
            target="_blank"
          >
            {t('earnPage.getInsuranceCoverage')}
          </ExternalLink>
          {/* <Migration /> */}
        </Box>
      </GridContainer>
    </PageWrapper>
  )
}
export default PoolUI
