import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Box, TextInput } from '@pangolindex/components'
import { useToken } from 'src/hooks/Tokens'
import { useTokenComparator } from 'src/components/SearchModal/sorting'
import { Currency, Token, CAVAX, ChainId } from '@antiyro/sdk'
import { filterTokens } from 'src/components/SearchModal/filtering'
import { AddInputWrapper, PopoverContainer, CurrencyList } from './styled'
import CurrencyRow from './CurrencyRow'
import usePrevious from 'src/hooks/usePrevious'
import { isAddress } from 'src/utils'
import { AppDispatch } from 'src/state'
import { addCurrency } from 'src/state/watchlists/actions'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useActiveWeb3React } from 'src/hooks'

interface Props {
  getRef?: (ref: any) => void
  coins: Array<Token>
  isOpen: boolean
  onSelectCurrency: (currency: Token) => void
}

const currencyKey = (currency: Currency, chainId: ChainId): string => {
  return currency instanceof Token ? currency.address : currency === CAVAX[chainId || ChainId.AVALANCHE] ? 'AVAX' : ''
}

const CurrencyPopover: React.FC<Props> = ({ getRef = () => {}, coins, isOpen, onSelectCurrency }) => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [invertSearchOrder] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const lastOpen = usePrevious(isOpen)

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setSearchQuery('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 500)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const isAddressSearch = isAddress(searchQuery)
  const searchToken = useToken(searchQuery)

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredTokens: Token[] = useMemo(() => {
    if (isAddressSearch) return searchToken ? [searchToken] : []
    return filterTokens(Object.values(coins), searchQuery)
  }, [isAddressSearch, searchToken, coins, searchQuery])

  const filteredSortedTokens: Token[] = useMemo(() => {
    if (searchToken) return [searchToken]
    const sorted = filteredTokens.sort(tokenComparator)

    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter(s => s.length > 0)
    if (symbolMatch.length > 1) return sorted

    return [
      ...(searchToken ? [searchToken] : []),
      // sort any exact symbol matches first
      ...sorted.filter(token => token.symbol?.toLowerCase() === symbolMatch[0]),
      ...sorted.filter(token => token.symbol?.toLowerCase() !== symbolMatch[0])
    ]
  }, [filteredTokens, searchQuery, searchToken, tokenComparator])

  const currencies = filteredSortedTokens

  const dispatch = useDispatch<AppDispatch>()

  const onCurrencySelection = useCallback(
    (address: string) => {
      dispatch(addCurrency(address))
    },
    [dispatch]
  )

  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: Token = data?.[index]

      return currency ? (
        <CurrencyRow
          key={index}
          style={style}
          currency={currency}
          onSelect={address => {
            onSelectCurrency(currency)
            onCurrencySelection(address)
          }}
        />
      ) : null
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  
  const { chainId } = useActiveWeb3React()

  return (
    <PopoverContainer ref={ref => getRef(ref)}>
      {/* Render Search Token Input */}
      <Box padding="0px 10px">
        <AddInputWrapper>
          <TextInput
            placeholder="Search"
            onChange={(value: any) => {
              setSearchQuery(value as string)
            }}
            value={searchQuery}
            getRef={(ref: HTMLInputElement) => ((inputRef as any).current = ref)}
          />
        </AddInputWrapper>
      </Box>

      <CurrencyList>
        {/* {currencies.map((currency, index) => (
            <CurrencyRow
              key={index}
              currency={currency}
              onSelect={currency => {
                onCurrencySelection(currency)
              }}
            />
          ))} */}
        <AutoSizer disableWidth>
          {({ height }) => (
            <FixedSizeList
              height={height}
              width="100%"
              itemCount={currencies.length}
              itemSize={45}
              itemData={currencies}
              itemKey={(index, data) => currencyKey(data[index], chainId || ChainId.AVALANCHE)}
            >
              {Row}
            </FixedSizeList>
          )}
        </AutoSizer>
      </CurrencyList>
    </PopoverContainer>
  )
}
export default CurrencyPopover
