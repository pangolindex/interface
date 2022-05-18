import React, { useContext, useEffect, useState } from 'react'
import { Box, Text } from '@pangolindex/components'
import Scrollbars from 'react-custom-scrollbars'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'

import { useActiveWeb3React } from 'src/hooks'
import { AllChain, useGetChainsBalances } from 'src/state/portifolio/hooks'

import { PortfolioToken, PortfolioInfo } from './styleds'
import { Card, CardHeader, CardBody } from '../styleds'
import Loader from 'src/components/Loader'
import Info2 from 'src/assets/svg/info2.svg'
import { ALL_CHAINS } from '@pangolindex/sdk'

export default function PortfolioWidget() {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const { data: balances, isLoading } = useGetChainsBalances()
  const [availableBalances, setAvailableBalances] = useState<{ chainID: number; balance: number }[]>([])

  const CLONE_ALL_CHAINS = [...ALL_CHAINS]
  CLONE_ALL_CHAINS.push(AllChain)

  useEffect(() => {
    if (balances) {
      setAvailableBalances(balances.filter(chain => chain.balance > 0.01 && chain.chainID !== 0))
    }
  }, [balances])

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
        {account ? (
          isLoading ? (
            <Loader
              size="10%"
              stroke={theme.yellow3}
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                display: 'block'
              }}
            />
          ) : availableBalances.length > 0 ? (
            <Scrollbars style={{ height: 100 }}>
              {availableBalances.map((chain, index) => (
                <PortfolioToken key={index} height={35}>
                  ${' '}
                  {chain.balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                  <img
                    width={'40px'}
                    src={CLONE_ALL_CHAINS.filter(value => value.chain_id === chain.chainID)[0]?.logo}
                    alt={'Chain logo'}
                    style={{ marginLeft: '12px' }}
                  />
                </PortfolioToken>
              ))}
            </Scrollbars>
          ) : (
            <Box height={100}>
              <Text color="text1" fontSize={50}>
                $ 0
              </Text>
            </Box>
          )
        ) : (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Text color="text1" fontSize={24} fontWeight={500}>
              {`${t('swapPage.connectWalletViewPortFolio')}`}
            </Text>
          </Box>
        )}
        <PortfolioInfo>
          <img width={'24px'} src={Info2} alt="i" />{' '}
          <Text color="text8">Includes coins, pools and other holdings in your current wallet</Text>
        </PortfolioInfo>
      </CardBody>
    </Card>
  )
}
