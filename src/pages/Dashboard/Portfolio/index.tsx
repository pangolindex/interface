import React, { useContext, useEffect, useState } from 'react'
import { Box, Text } from '@pangolindex/components'
import Scrollbars from 'react-custom-scrollbars'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'

import { CHAINS, ChainsId } from 'src/constants/chains'
import { useActiveWeb3React } from 'src/hooks'
import { useGetChainsBalances } from 'src/state/portifolio/hooks'

import { PortfolioToken, PortfolioInfo } from './styleds'
import { Card, CardHeader, CardBody } from '../styleds'
import Loader from 'src/components/Loader'
import Info2 from 'src/assets/svg/info2.svg'

export default function PortfolioWidget() {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  // portifolio
  // const [selectChain, setSelectChain] = useState<CHAIN>(CHAINS[ChainsId.All])
  // const handleSelectChain = (newChain: CHAIN) => {
  //   setSelectChain(newChain)
  // }
  const { data: balances, isLoading } = useGetChainsBalances()
  const [availableBalances, setAvailableBalances] = useState<{ chainID: ChainsId; balance: number }[]>([])

  useEffect(() => {
    const availableBalance: { chainID: ChainsId; balance: number }[] = []
    Object.keys(ChainsId)
      .filter(k => typeof k === 'string')
      .forEach(key => {
        if (isNaN(parseInt(key)) && key.toLowerCase() !== 'all' && balances) {
          const chainid = ChainsId[key as keyof typeof ChainsId]
          const balance = balances[chainid]
          if (!!balance && balance >= 0.1) {
            availableBalance.push({
              chainID: chainid,
              balance: balance
            })
          }
        }
      })
    setAvailableBalances(availableBalance)
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
                <PortfolioToken key={index} height={50}>
                  ${' '}
                  {chain.balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                  <img
                    width={'50px'}
                    src={CHAINS[chain.chainID].logo}
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
          <img width={'24px'} src={Info2} alt="i" /> &nbsp;&nbsp;Includes coins, pools and other holdings in your
          current wallet
        </PortfolioInfo>
      </CardBody>
    </Card>
  )
}
