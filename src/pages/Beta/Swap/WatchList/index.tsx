import React, { useContext, useRef, useState } from 'react'
import { Text, Box, Button } from '@pangolindex/components'
import { ChainId } from '@pangolindex/sdk'
import { Plus } from 'react-feather'
import { ThemeContext } from 'styled-components'
// import { LINK, PNG, TIME, AAVEe, APEIN, BIFI, PEFI } from 'src/constants'
import { COIN_LISTS } from 'src/constants/coinLists'
import { useActiveWeb3React } from 'src/hooks'
import WatchlistRow from './WatchlistRow'
import { WatchListRoot, GridContainer } from './styleds'
import Scrollbars from 'react-custom-scrollbars'
import CoinChart from './CoinChart'
import CurrencyPopover from './CurrencyPopover'
// import { usePopper } from 'react-popper'
import { useOnClickOutside } from 'src/hooks/useOnClickOutside'
import useToggle from 'src/hooks/useToggle'
import { useSelectedCurrencyLists } from 'src/state/watchlists/hooks'

const WatchList = () => {
  const { chainId = ChainId.AVALANCHE } = useActiveWeb3React()
  const coins = COIN_LISTS.map(coin => coin[chainId])
  const watchListCurrencies = useSelectedCurrencyLists()
  const theme = useContext(ThemeContext)
  const [selectedToken, setSelectedToken] = useState(coins[0])

  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  //  const [referenceElement, setReferenceElement] = useState<HTMLDivElement>()
  // const [popperElement, setPopperElement] = useState<HTMLDivElement>()
  const popoverRef = useRef<HTMLInputElement>(null)
  const referenceElement = useRef<HTMLInputElement>(null)
  // const { styles, attributes } = usePopper(referenceElement, popperElement, {
  //   placement: 'auto',
  //   strategy: 'fixed',
  //   modifiers: [{ name: 'offset', options: { offset: [8, 8] } }]
  // })

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <WatchListRoot>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Text color="text1" fontSize={32} fontWeight={500}>
          WatchList
        </Text>
        <Box bgColor={theme.bg5 as any} p={'5px'} ref={node as any}>
          <Box ref={referenceElement} onClick={toggle}>
            <Button
              variant="primary"
              backgroundColor="text8"
              color="text1"
              width={'32px'}
              height={'32px'}
              padding="0px"
            >
              <Plus size={12} color={theme.text1} />
            </Button>
          </Box>

          {open && (
            <CurrencyPopover
              getRef={(ref: HTMLInputElement) => ((popoverRef as any).current = ref)}
              coins={coins}
              isOpen={open}
            />
          )}
        </Box>
      </Box>
      <GridContainer>
        <CoinChart coin={selectedToken} />
        <Box>
          <Scrollbars>
            {(watchListCurrencies || []).map(coin => (
              <WatchlistRow coin={coin} key={coin.address} onClick={() => setSelectedToken(coin)} />
            ))}
          </Scrollbars>
        </Box>
      </GridContainer>
    </WatchListRoot>
  )
}
export default WatchList
