import React from 'react'
import styled from 'styled-components'
import {TYPE} from '../../theme'

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`

const Section = styled.section`
  padding: 10px;
`

interface FeesReportWrappedProps {
  symbol?: string
  fee?: number
  feeSymbol?: string
  networkFee?: number
  networkFeeSymbol?: string
  amount: string
}

export default function FeesReportWrapped({
                                            symbol,
                                            fee,
                                            feeSymbol,
                                            networkFee,
                                            networkFeeSymbol,
                                            amount,
                                          }: FeesReportWrappedProps) {

  let total = 0
  if (fee !== undefined) total += fee
  if (networkFee !== undefined) total += networkFee

  return (
    <Section>
      <Row>
        {fee !== undefined && feeSymbol !== undefined && (
          <>
            <TYPE.black>Bridge Fee:</TYPE.black>
            <TYPE.black>
              {fee} {feeSymbol}
            </TYPE.black>
          </>
        )}
      </Row>

      <Row>
        {networkFee !== undefined && networkFeeSymbol !== undefined && (
          <>
            <TYPE.black>Network Fee:</TYPE.black>
            <TYPE.black>
              {networkFee} {networkFeeSymbol}
            </TYPE.black>
          </>
        )}

      </Row>
      <Row>
        {networkFeeSymbol !== undefined && total > 0 && (
          <>
            <TYPE.black>Total:</TYPE.black>
            <TYPE.black>
              {total.toFixed(5)} {networkFeeSymbol}
            </TYPE.black>
          </>
        )}
      </Row>
      <Row>
        {symbol !== undefined && (
          <>
            <TYPE.black>Transfer Amount:</TYPE.black>
            <TYPE.black>
              {Number(amount)?.toFixed(
                3
              )}{' '}
              {symbol}
            </TYPE.black>
          </>
        )}
      </Row>
    </Section>
  )

}

