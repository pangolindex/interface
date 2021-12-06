import React, { useMemo, useState, useCallback } from 'react'
import { TextInput, Box, Text } from '@pangolindex/components'
import Drawer from '../Drawer'
import { useAllTokens, useToken } from 'src/hooks/Tokens'
import { useTokenComparator } from 'src/components/SearchModal/sorting'
import { CAVAX, Currency, currencyEquals, Token } from '@pangolindex/sdk'
import { filterTokens } from 'src/components/SearchModal/filtering'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { isAddress } from 'src/utils'
import { CurrencyList, ManageList, ListLogo } from './styled'
import CurrencyRow from './CurrencyRow'
import { useSelectedListInfo } from 'src/state/lists/hooks'
import BaseRow, { RowBetween } from 'src/components/Row'
import TokenListDrawer from '../TokenListDrawer'

interface Props {
  isOpen: boolean
  onClose: () => void
  onCurrencySelect: (currency: Currency) => void
  selectedCurrency?: Currency
  otherSelectedCurrency?: Currency
}

const currencyKey = (currency: Currency): string => {
  return currency instanceof Token ? currency.address : currency === CAVAX ? 'AVAX' : ''
}

const SelectTokenDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  onCurrencySelect,
  otherSelectedCurrency,
  selectedCurrency
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isTokenListOpen, setIsTokenListOpen] = useState<boolean>(false)
  const [invertSearchOrder] = useState<boolean>(false)

  const allTokens = useAllTokens()
  const selectedListInfo = useSelectedListInfo()
  console.log(selectedListInfo)

  const isAddressSearch = isAddress(searchQuery)
  const searchToken = useToken(searchQuery)

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredTokens: Token[] = useMemo(() => {
    if (isAddressSearch) return searchToken ? [searchToken] : []
    return filterTokens(Object.values(allTokens), searchQuery)
  }, [isAddressSearch, searchToken, allTokens, searchQuery])

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

  const currencies = useMemo(() => [Currency.CAVAX, ...filteredSortedTokens], [filteredSortedTokens])

  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: Currency = data?.[index]

      const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))
      const otherSelected = Boolean(otherSelectedCurrency && currencyEquals(otherSelectedCurrency, currency))
      const handleSelect = () => onCurrencySelect(currency)
      return currency ? (
        <CurrencyRow
          style={style}
          currency={currency}
          isSelected={isSelected}
          onSelect={() => {
            handleSelect()
            onClose()
          }}
          otherSelected={otherSelected}
        />
      ) : null
    },
    [selectedCurrency, otherSelectedCurrency, onCurrencySelect]
  )

  return (
    <Drawer title="Select a token" isOpen={isOpen} onClose={onClose}>
      {/* Render Search Token Input */}
      <Box padding="0px 10px">
        <TextInput
          placeholder="Search"
          onChange={(value: any) => {
            setSearchQuery(value as string)
          }}
        />
      </Box>
      {/* Render All Selected Tokens */}
      <CurrencyList>
        <AutoSizer disableWidth>
          {({ height }) => (
            <FixedSizeList
              height={height}
              width="100%"
              itemCount={currencies.length}
              itemSize={56}
              itemData={currencies}
              itemKey={(index, data) => currencyKey(data[index])}
            >
              {Row}
            </FixedSizeList>
          )}
        </AutoSizer>
      </CurrencyList>
      {/* Render Selected Token List Info */}
      <ManageList onClick={() => setIsTokenListOpen(true)}>
        {selectedListInfo.multipleSelected ? (
          <RowBetween>
            <Text fontSize={14} color="text1">
              {selectedListInfo.selectedCount} lists selected
            </Text>
            <Text fontSize={12} color="text1">
              Change
            </Text>
          </RowBetween>
        ) : (
          <RowBetween>
            <BaseRow>
              <ListLogo
                size={24}
                src={selectedListInfo?.current?.logoURI}
                alt={`${selectedListInfo?.current?.name} list logo`}
              />
              <Text fontSize={14} color="text1">
                {selectedListInfo?.current?.name}
              </Text>
            </BaseRow>
            <Text fontSize={12} color="text1">
              Change
            </Text>
          </RowBetween>
        )}
      </ManageList>
      {/* Render Token List Selection Drawer */}
      <TokenListDrawer isOpen={isTokenListOpen} onClose={() => setIsTokenListOpen(false)} />
    </Drawer>
  )
}
export default SelectTokenDrawer
