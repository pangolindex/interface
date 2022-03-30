import { Trade, ChainId } from '@antiyro/sdk'
import React, { Fragment, memo, useContext } from 'react'
import { ChevronRight } from 'react-feather'
import { Flex } from 'rebass'
import { ThemeContext } from 'styled-components'
import { TYPE } from '../../theme'
import CurrencyLogo from '../CurrencyLogo'

export default memo(function SwapRoute({ chainId, trade }: { chainId: ChainId; trade: Trade }) {
  const theme = useContext(ThemeContext)
  return (
    <Flex
      px="1rem"
      py="0.5rem"
      my="0.5rem"
      style={{ border: `1px solid ${theme.bg3}`, borderRadius: '1rem' }}
      flexWrap="wrap"
      width="100%"
      justifyContent="space-evenly"
      alignItems="center"
    >
      {trade.route.path.map((token, i, path) => {
        const isLastItem: boolean = i === path.length - 1
        return (
          <Fragment key={i}>
            <Flex my="0.5rem" alignItems="center" style={{ flexShrink: 0 }}>
              {chainId && <CurrencyLogo currency={token} size={24} chainId={chainId} />}
              <TYPE.black fontSize={14} color={theme.text1} ml="0.5rem">
                {token.symbol}
              </TYPE.black>
            </Flex>
            {isLastItem ? null : <ChevronRight color={theme.text2} />}
          </Fragment>
        )
      })}
    </Flex>
  )
})
