import React, { useContext, useRef, useState, useMemo } from 'react'
import { Text, Box, Button } from '@pangolindex/components'
import { ChainId, Token } from '@pangolindex/sdk'
import { Plus } from 'react-feather'
import { ThemeContext } from 'styled-components'
import { PNG } from 'src/constants'
import { COIN_LISTS } from 'src/constants/coinLists'
import { useActiveWeb3React } from 'src/hooks'
import WatchlistRow from './WatchlistRow'
import { WatchListRoot, GridContainer } from './styleds'
import Scrollbars from 'react-custom-scrollbars'
import CoinChart from './CoinChart'
import CurrencyPopover from './CurrencyPopover'
import { useOnClickOutside } from 'src/hooks/useOnClickOutside'
import useToggle from 'src/hooks/useToggle'
import { useSelectedCurrencyLists } from 'src/state/watchlists/hooks'
import { useTranslation } from 'react-i18next'

const WatchList = () => {
  const { chainId = ChainId.AVALANCHE } = useActiveWeb3React()
  const { t } = useTranslation()

  const coins = COIN_LISTS.map(coin => coin[chainId]).filter(coin => !!coin)
  const watchListCurrencies = useSelectedCurrencyLists()
  const theme = useContext(ThemeContext)
  const [selectedToken, setSelectedToken] = useState(watchListCurrencies?.[0] || ({} as Token))

  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()

  const popoverRef = useRef<HTMLInputElement>(null)
  const referenceElement = useRef<HTMLInputElement>(null)

  const currencies = useMemo(
    () => ((watchListCurrencies || []).length === 0 ? ([PNG[chainId]] as Token[]) : (watchListCurrencies as Token[])),

    [chainId, watchListCurrencies]
  )

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <WatchListRoot>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Text color="text1" fontSize={32} fontWeight={500}>
          {t('swapPage.watchList')}
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
              onSelectCurrency={(currency: Token) => setSelectedToken(currency)}
            />
          )}
        </Box>
      </Box>
      <GridContainer>
        <CoinChart coin={selectedToken} />
        <Box>
          <Scrollbars>
            {(currencies || []).map(coin => (
              <WatchlistRow
                coin={coin}
                key={coin.address}
                onClick={() => setSelectedToken(coin)}
                isSelected={coin?.address === selectedToken?.address}
              />
            ))}
          </Scrollbars>
        </Box>
      </GridContainer>
    </WatchListRoot>
  )
}
export default WatchList
