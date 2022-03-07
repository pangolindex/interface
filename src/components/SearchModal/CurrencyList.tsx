import { Currency, CurrencyAmount, currencyEquals, CAVAX, Token, ChainId } from '@pangolindex/sdk'
import React, { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useSelectedTokenList, WrappedTokenInfo } from '../../state/lists/hooks'
import { useAddUserToken, useRemoveUserAddedToken } from '../../state/user/hooks'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { LinkStyledButton, TYPE } from '../../theme'
import { useIsUserAddedToken } from '../../hooks/Tokens'
import Column from '../Column'
import { RowFixed } from '../Row'
import CurrencyLogo from '../CurrencyLogo'
import { MouseoverTooltip } from '../Tooltip'
import { FadedSpan, MenuItem } from './styleds'
import Loader from '../Loader'
import { isTokenOnList } from '../../utils'
import { useTranslation } from 'react-i18next'
import { useChainId } from 'src/hooks'

function currencyKey(currency: Currency, chainId: ChainId): string {
  return currency instanceof Token ? currency.address : currency === CAVAX[chainId || ChainId.AVALANCHE] ? 'AVAX' : ''
}

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

const Tag = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text2};
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`

function Balance({ balance }: { balance: CurrencyAmount }) {
  return <StyledBalanceText title={balance.toExact()}>{balance.toSignificant(4)}</StyledBalanceText>
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />
  }

  const tags = currency.tags
  if (!tags || tags.length === 0) return <span />

  const tag = tags[0]

  return (
    <TagContainer>
      <MouseoverTooltip text={tag.description}>
        <Tag key={tag.id}>{tag.name}</Tag>
      </MouseoverTooltip>
      {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join('; \n')}
        >
          <Tag>...</Tag>
        </MouseoverTooltip>
      ) : null}
    </TagContainer>
  )
}

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style
}: {
  currency: Currency
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
}) {
  const { account, chainId } = useActiveWeb3React()
  const key = currencyKey(currency, useChainId())
  const selectedTokenList = useSelectedTokenList()
  const isOnSelectedList = isTokenOnList(selectedTokenList, useChainId(), currency)
  const customAdded = useIsUserAddedToken(currency)
  const balance = useCurrencyBalance(useChainId(), account ?? undefined, currency)

  const removeToken = useRemoveUserAddedToken()
  const addToken = useAddUserToken()
  const { t } = useTranslation()

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      style={style}
      className={`token-item-${key}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <CurrencyLogo currency={currency} size={'24px'} chainId={useChainId()} />
      <Column>
        <Text title={currency.name} fontWeight={500}>
          {currency.symbol}
        </Text>
        <FadedSpan>
          {!isOnSelectedList && customAdded ? (
            <TYPE.main fontWeight={500}>
              {t('searchModal.addedByUser')}
              <LinkStyledButton
                onClick={event => {
                  event.stopPropagation()
                  if (chainId && currency instanceof Token) removeToken(chainId, currency.address)
                }}
              >
                ({t('searchModal.remove')})
              </LinkStyledButton>
            </TYPE.main>
          ) : null}
          {!isOnSelectedList && !customAdded ? (
            <TYPE.main fontWeight={500}>
              {t('searchModal.foundByAddress')}
              <LinkStyledButton
                onClick={event => {
                  event.stopPropagation()
                  if (currency instanceof Token) addToken(currency)
                }}
              >
                ({t('searchModal.add')})
              </LinkStyledButton>
            </TYPE.main>
          ) : null}
        </FadedSpan>
      </Column>
      <TokenTags currency={currency} />
      <RowFixed style={{ justifySelf: 'flex-end' }}>
        {balance ? <Balance balance={balance} /> : account ? <Loader /> : null}
      </RowFixed>
    </MenuItem>
  )
}

export default function CurrencyList({
  chainId,
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showETH
}: {
  chainId: ChainId
  height: number
  currencies: Currency[]
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherCurrency?: Currency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showETH: boolean
}) {
  // const itemData = useMemo(() => (showETH ? [Currency.CAVAX, ...currencies] : currencies), [currencies, showETH])
  const itemData = useMemo(() => (showETH ? [CAVAX[chainId], ...currencies] : currencies), [
    currencies,
    showETH,
    chainId
  ])

  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: Currency = data[index]
      const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))
      const otherSelected = Boolean(otherCurrency && currencyEquals(otherCurrency, currency))
      const handleSelect = () => onCurrencySelect(currency)
      return (
        <CurrencyRow
          style={style}
          currency={currency}
          isSelected={isSelected}
          onSelect={handleSelect}
          otherSelected={otherSelected}
        />
      )
    },
    [onCurrencySelect, otherCurrency, selectedCurrency]
  )

  const itemKey = useCallback((index: number, data: any) => currencyKey(data[index], chainId || ChainId.AVALANCHE), [
    chainId
  ])

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}
