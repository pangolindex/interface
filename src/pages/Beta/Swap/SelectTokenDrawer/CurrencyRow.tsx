import React, { useCallback } from 'react'
import { Text, CurrencyLogo } from '@0xkilo/components'
import { CurrencyRowRoot, Balance } from './styled'
import { Currency, ChainId } from '@antiyro/sdk'
import { useActiveWeb3React } from 'src/hooks'
// import { useSelectedTokenList } from 'src/state/lists/hooks'
// import { isTokenOnList } from 'src/utils'
// import { useIsUserAddedToken } from 'src/hooks/Tokens'
import { useCurrencyBalance } from 'src/state/wallet/hooks'
import Loader from 'src/components/Loader'
// import { useAddUserToken, useRemoveUserAddedToken } from 'src/state/user/hooks'
// import { useTranslation } from 'react-i18next'

interface Props {
  currency: Currency
  style: any
  onSelect: (currency: Currency) => void
  isSelected: boolean
  otherSelected: boolean
}

const CurrencyRow: React.FC<Props> = props => {
  const { currency, style, onSelect, isSelected, otherSelected } = props
  const { account, chainId } = useActiveWeb3React()
  // const selectedTokenList = useSelectedTokenList()
  // const isOnSelectedList = isTokenOnList(selectedTokenList, currency)
  // const customAdded = useIsUserAddedToken(currency)
  const balance = useCurrencyBalance(chainId || ChainId.AVALANCHE, account ?? undefined, currency)

  // const removeToken = useRemoveUserAddedToken()
  // const addToken = useAddUserToken()
  // const { t } = useTranslation()

  // console.log(currency.symbol, balance)

  const handleSelect = useCallback(() => {
    onSelect(currency)
  }, [onSelect, currency])

  return (
    <CurrencyRowRoot style={style} onClick={handleSelect} disabled={isSelected} selected={otherSelected}>
      <CurrencyLogo currency={currency} size={'24px'} />
      <Text color="text1" fontSize={14} title={currency?.name}>
        {currency?.symbol}
      </Text>
      <Balance color="text1" fontSize={14}>
        {balance ? balance.toSignificant(4) : account ? <Loader /> : null}
      </Balance>
    </CurrencyRowRoot>
  )
}
export default CurrencyRow
