import React from 'react'
import { Box, Text } from '@pangolindex/components'
import Scrollbars from 'react-custom-scrollbars'
import { useTranslation } from 'react-i18next'

import { CHAINS, ChainsId } from 'src/constants/chains'
import { useActiveWeb3React } from 'src/hooks'
import { useGetChainsBalances } from 'src/state/portifolio/hooks'

import { PortfolioToken, PortfolioInfo } from './styleds'
import { Card, CardHeader, CardBody } from '../styleds'
import Loader from 'src/components/Loader'
import Info2 from 'src/assets/svg/info2.svg'

export default function PortfolioWidget() {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  // portifolio
  // const [selectChain, setSelectChain] = useState<CHAIN>(CHAINS[ChainsId.All])
  // const handleSelectChain = (newChain: CHAIN) => {
  //   setSelectChain(newChain)
  // }
  const [balances, loading] = useGetChainsBalances()

  return (
    <Card>
      <CardHeader>
        {t('dashboardPage.portfolioValue') + ' in All Chains'}
        {/* <HeaderDropdowns>
                  <ChainDropdown selectChain={selectChain} handleSelectChain={handleSelectChain}></ChainDropdown>
                </HeaderDropdowns> */}
      </CardHeader>
      <CardBody>
        {/* <TradingViewChart /> */}
        {!!account ? (
          loading ? (
            <Loader
              size="10%"
              stroke="#f5bb00"
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                display: 'block'
              }}
            />
          ) : (
            <Scrollbars style={{ height: 190 }}>
              {Object.keys(ChainsId).map(
                (key, index) =>
                  isNaN(parseInt(key)) &&
                  key !== 'All' &&
                  !!balances[ChainsId[key as keyof typeof ChainsId]] &&
                  balances[ChainsId[key as keyof typeof ChainsId]] >= 1 && (
                    <PortfolioToken key={index} height={50}>
                      $
                      {!!balances[ChainsId[key as keyof typeof ChainsId]]
                        ? balances[ChainsId[key as keyof typeof ChainsId]].toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })
                        : 0}
                      <img
                        width={'50px'}
                        src={CHAINS[ChainsId[key as keyof typeof ChainsId]].logo}
                        alt={'Chain logo'}
                        style={{ marginLeft: '12px' }}
                      />
                    </PortfolioToken>
                  )
              )}
            </Scrollbars>
          )
        ) : (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Text color="text1" fontSize={24} fontWeight={500}>
              {`${t('swapPage.connectWalletViewPortFolio')}`}
            </Text>
          </Box>
        )}
        <PortfolioInfo>
          <img width={'24px'} src={Info2} alt="i" /> &nbsp;&nbsp;Includes coin, pools, and unclaimed rewards worth in
          current wallet
        </PortfolioInfo>
      </CardBody>
    </Card>
  )
}
