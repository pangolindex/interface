import React, { useContext, useRef, useState, useMemo } from 'react'
import { Box, Button } from '@pangolindex/components'
import { ChainId, Token } from '@pangolindex/sdk'
import { Plus } from 'react-feather'
import { ThemeContext } from 'styled-components'
import { PNG } from 'src/constants/tokens'
import { useActiveWeb3React } from 'src/hooks'
import WatchlistRow from './WatchlistRow'
import { WatchListRoot, GridContainer, Title, DesktopWatchList, MobileWatchList } from './styleds'
import Scrollbars from 'react-custom-scrollbars'
import CoinChart from './CoinChart'
import CurrencyPopover from './CurrencyPopover'
import { useOnClickOutside } from 'src/hooks/useOnClickOutside'
import useToggle from 'src/hooks/useToggle'
import { useSelectedCurrencyLists } from 'src/state/watchlists/hooks'
import { useTranslation } from 'react-i18next'
import { useAllTokens } from 'src/hooks/Tokens'
import ShowMore from 'src/components/Beta/ShowMore'
import { Hidden } from 'src/theme'
import { CHAINS } from 'src/constants/chains'

type Props = {
  isLimitOrders?: boolean
}

const WatchList: React.FC<Props> = ({ isLimitOrders }) => {
  const { chainId = ChainId.AVALANCHE } = useActiveWeb3React()
  const { t } = useTranslation()
  const [showMore, setShowMore] = useState(false as boolean)
  const allTokens = useAllTokens()
  const coins = Object.values(allTokens || {})

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
        <Title>{t('swapPage.watchList')}</Title>
        <Box bgColor={theme.bg5 as any} position="relative" p={'5px'} ref={node as any}>
          <Box ref={referenceElement} onClick={toggle}>
            <Button
              variant="primary"
              backgroundColor="primary"
              color="white"
              width={'32px'}
              height={'32px'}
              padding="0px"
            >
              <Plus size={12} color={'black'} />
            </Button>
          </Box>

          {open && (
            <CurrencyPopover
              getRef={(ref: HTMLInputElement) => ((popoverRef as any).current = ref)}
              coins={coins}
              isOpen={open}
              onSelectCurrency={(currency: Token) => {
                setSelectedToken(currency)
                toggle()
              }}
            />
          )}
        </Box>
      </Box>
      <GridContainer isLimitOrders={isLimitOrders}>
        {CHAINS[chainId].is_mainnet
          ? !isLimitOrders && (
              <Hidden upToSmall={true}>
                <CoinChart coin={selectedToken} />
              </Hidden>
            )
          : isLimitOrders && (
              <Hidden upToSmall={true}>
                <CoinChart coin={selectedToken} />
              </Hidden>
            )}

        <DesktopWatchList>
          <Scrollbars>
            {(currencies || []).map(coin => (
              <WatchlistRow
                coin={coin}
                key={coin.address}
                onClick={() => setSelectedToken(coin)}
                onRemove={() => setSelectedToken(PNG[chainId])}
                isSelected={coin?.address === selectedToken?.address}
              />
            ))}
          </Scrollbars>
        </DesktopWatchList>
        <MobileWatchList>
          {(currencies || []).slice(0, 3).map(coin => (
            <WatchlistRow
              coin={coin}
              key={coin.address}
              onClick={() => setSelectedToken(coin)}
              onRemove={() => setSelectedToken(PNG[chainId])}
              isSelected={coin?.address === selectedToken?.address}
            />
          ))}

          {showMore &&
            (currencies || [])
              .slice(3)
              .map(coin => (
                <WatchlistRow
                  coin={coin}
                  key={coin.address}
                  onClick={() => setSelectedToken(coin)}
                  onRemove={() => setSelectedToken(PNG[chainId])}
                  isSelected={coin?.address === selectedToken?.address}
                />
              ))}

          {currencies.length > 3 && <ShowMore showMore={showMore} onToggle={() => setShowMore(!showMore)} />}
        </MobileWatchList>
      </GridContainer>
    </WatchListRoot>
  )
}
export default WatchList
