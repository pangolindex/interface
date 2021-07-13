import React from 'react'
import {AdvancedDetailsFooter} from '../swap/AdvancedSwapDetailsDropdown'
import {useGetQuote} from '../../state/wyre/hooks'
import {RowBetween, RowFixed} from "../Row";
import {AutoColumn} from "../Column";
import { TYPE } from '../../theme'
import QuestionHelper from "../QuestionHelper";


export default function Footer() {

  const quote = useGetQuote().quote
  const sourceCurrency = !quote ? 'USD' : quote.sourceCurrency
  const destCurrency = !quote ? '' : quote.destCurrency
  const amountReceivable = !quote ? 0 : quote.destAmount.toFixed(2)
  const exchangeRate = !quote ? 0 : quote.exchangeRate > 0 ? (1/quote.exchangeRate) : 0
  const transactionFee = !quote ? 0 : quote.fees[sourceCurrency]
  const networkFee = !quote ? 0 : quote.sourceAmount - (quote.sourceAmountWithoutFees + transactionFee)
  const total = !quote ? 0 : quote.sourceAmount
  const locale = navigator.language

  function formatAndLocalizeCurrencyAmount(amount: number): string {
    return Intl.NumberFormat(locale, {style: 'currency', currency: sourceCurrency}).format(amount)
  }

  return (
    <AdvancedDetailsFooter show={quote}>
      <AutoColumn gap="md" style={{ padding: '0 24px' }}>
      <RowBetween>
        <RowFixed>
          <TYPE.black fontSize={14} fontWeight={400}>
            You'll receive
          </TYPE.black>
          <QuestionHelper text={'Premium'} />
        </RowFixed>
        {amountReceivable}&nbsp;{destCurrency}
      </RowBetween>
      <RowBetween>
        <RowFixed>
          <TYPE.black fontSize={14} fontWeight={400}>
            Exchange rate (1 {destCurrency} =)
          </TYPE.black>
        </RowFixed>
        {formatAndLocalizeCurrencyAmount(exchangeRate)}
      </RowBetween>
      <RowBetween>
        <RowFixed>
          <TYPE.black fontSize={14} fontWeight={400}>
            Transaction fees
          </TYPE.black>
          <QuestionHelper text='Transaction fees' />
        </RowFixed>
        {formatAndLocalizeCurrencyAmount(transactionFee)}
      </RowBetween>
      <RowBetween>
        <RowFixed>
          <TYPE.black fontSize={14} fontWeight={400}>
            Network fees
          </TYPE.black>
          <QuestionHelper text='Network fees' />
        </RowFixed>
        {formatAndLocalizeCurrencyAmount(networkFee)}
      </RowBetween>
      <RowBetween>
        <RowFixed>
          <TYPE.black fontSize={16} fontWeight={600}>
            Total
          </TYPE.black>
          <QuestionHelper text='Total amount to pay' />
        </RowFixed>
        <TYPE.black fontSize={16} fontWeight={600}>
          ~{formatAndLocalizeCurrencyAmount(total)}
        </TYPE.black>
      </RowBetween>
    </AutoColumn></AdvancedDetailsFooter>
  )
}