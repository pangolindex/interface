import React, { useCallback } from 'react'
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


  // @ts-ignore
  const handleFiatSelect = useCallback(
    (fiat: Fiat) => {
      onFiatSelect(fiat)
      onDismiss()
    },
    [onDismiss, onFiatSelect]
  )

  const Row = (props: ListChildComponentProps) => {
    const fiat = props.data[props.index]
    const isSelected = Boolean(fiat.symbol == 'USD')
    const onSelect = () => console.log(fiat)
    return (
      <MenuItem
        style={props.style}
        onClick={() => (isSelected ? null : onSelect())}
      >
        <FiatLogo size={'24px'} src={`${fiat.logo}`} alt={fiat.title}/>
        <Column>
          <Text title={fiat.title} fontWeight={500}>
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
          />
        </PaddedColumn>
          <Separator/>

          <div style={{ flex: '1' }}>
            <AutoSizer disableWidth>
              {({height}) => (
                <FixedSizeList
                  height={height}
                  width="100%"
                  itemData={SUPPORTED_FIAT_CURRENCIES}
                  itemCount={SUPPORTED_FIAT_CURRENCIES.length}
                  itemSize={56}
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
