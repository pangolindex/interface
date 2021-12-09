import React, { useContext, useState } from 'react'
import { Text, Box, Button } from '@pangolindex/components'
import { ChainId } from '@pangolindex/sdk'
import { Plus } from 'react-feather'
import { ThemeContext } from 'styled-components'
import { LINK, PNG, TIME, AAVEe, APEIN, BIFI, PEFI } from 'src/constants'
import { useActiveWeb3React } from 'src/hooks'
import WatchlistRow from './WatchlistRow'
import { WatchListRoot, GridContainer } from './styleds'
import Scrollbars from 'react-custom-scrollbars'
import CoinChart from './CoinChart'

const WatchList = () => {
  const { chainId = ChainId.AVALANCHE } = useActiveWeb3React()
  const coins = [PNG, LINK, TIME, AAVEe, APEIN, BIFI, PEFI].map(coin => coin[chainId])
  const theme = useContext(ThemeContext)
  const [selectedToken, setSelectedToken] = useState(coins[0])

  return (
    <WatchListRoot>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Text color="text1" fontSize={32} fontWeight={500}>
          WatchList
        </Text>
        <Box bgColor={theme.bg5 as any} p={'5px'}>
          <Button variant="primary" backgroundColor="text8" color="text1" width={'32px'} height={'32px'} padding="0px">
            <Plus size={12} color={theme.text1} />
          </Button>
        </Box>
      </Box>
      <GridContainer>
        <CoinChart coin={selectedToken} />
        <Box>
          <Scrollbars>
            {coins.map(coin => (
              <WatchlistRow coin={coin} key={coin.address} onClick={() => setSelectedToken(coin)} />
            ))}
          </Scrollbars>
        </Box>
      </GridContainer>
    </WatchListRoot>
  )
}
export default WatchList
