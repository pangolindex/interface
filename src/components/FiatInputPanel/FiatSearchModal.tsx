import React, {
  useRef,
  KeyboardEvent,
  RefObject,
  useMemo,
  useState,
  useCallback
} from 'react'
import Modal from '../Modal'
import {StyledInput} from '../PurchaseForm/input'
import {FixedSizeList, ListChildComponentProps} from 'react-window'
import Column from "../Column";
import {MenuItem, PaddedColumn, Separator} from "../SearchModal/styleds";
import {RowBetween} from "../Row";
import QuestionHelper from "../QuestionHelper";
import {CloseIcon} from "../../theme";
import {Fiat} from '../../constants/fiat'
import {Text} from 'rebass'
import AutoSizer from 'react-virtualized-auto-sizer'
import {SUPPORTED_FIAT_CURRENCIES} from "../../constants/fiat";
import {StyledEthereumLogo as FiatLogo} from "../CurrencyLogo";
import {filterFiats} from "./filtering";

interface FiatSearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  selectedFiat?: Fiat
  onFiatSelect: (fiat: Fiat) => void
}


export default function FiatSearchModal({
                                          isOpen,
                                          onDismiss,
                                          onFiatSelect,
                                          selectedFiat
                                        }: FiatSearchModalProps) {


  const handleFiatSelect = useCallback((fiat: Fiat) => {
    onFiatSelect(fiat)
    onDismiss()
  }, [onDismiss, onFiatSelect])

  const [searchQuery, setSearchQuery] = useState<string>('')
  const filteredFiats: Fiat[] = useMemo(() => {
    return filterFiats(SUPPORTED_FIAT_CURRENCIES, searchQuery)
  }, [searchQuery])
  const handleInput = useCallback(event => {
    const input = event.target.value
    setSearchQuery(input)
    fixedList.current?.scrollTo(0)
  }, [])
  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (filteredFiats.length > 0) {
          if (
            filteredFiats[0].symbol?.toLowerCase() === searchQuery.trim().toLowerCase() ||
            filteredFiats.length === 1
          ) {
            handleFiatSelect(filteredFiats[0])
          }
        }
      }
    },
    [handleFiatSelect, searchQuery, filteredFiats]
  )

  const fixedList = useRef<FixedSizeList>()
  const inputRef = useRef<HTMLInputElement>()

  const Row = (props: ListChildComponentProps) => {
    const fiat = props.data[props.index]
    const isSelected = Boolean(selectedFiat && (fiat.symbol === selectedFiat.symbol))
    const onSelect = () => handleFiatSelect(fiat)
    return (
      <MenuItem
        style={props.style}
        onClick={() => (isSelected ? null : onSelect())}
      >
        <FiatLogo size={'24px'} src={`${fiat.logo}`} alt={fiat.title}/>
        <Column>
          <Text title={fiat.name} fontWeight={(isSelected) ? 700 : 500}>
            {fiat.symbol}
          </Text>
        </Column>
      </MenuItem>
    )
  }
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={80} minHeight={80}>

      <Column style={{width: '100%', flex: '1 1'}}>
        <PaddedColumn gap="14px">
          <RowBetween>
            <Text fontWeight={500} fontSize={16}>
              Select a currency
              <QuestionHelper text="Find a currency by its name or symbol."/>
            </Text>
            <CloseIcon onClick={onDismiss}/>
          </RowBetween>
          <StyledInput
            type="text"
            id="token-search-input"
            placeholder="Search"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            onKeyDown={handleEnter}
          />
        </PaddedColumn>
        <Separator/>

        <div style={{flex: '1'}}>
          <AutoSizer disableWidth>
            {({height}) => (
              <FixedSizeList
                height={height}
                width="100%"
                itemData={filteredFiats}
                itemCount={filteredFiats.length}
                itemSize={56}
                ref={fixedList as any}
              >
                {Row}
              </FixedSizeList>
            )}
          </AutoSizer>
        </div>
      </Column>
    </Modal>
  )
}
