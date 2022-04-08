/* eslint-disable */
import React from 'react'
import { ChainId, CHAIN_ID_TERRA, isNativeDenom } from '@certusone/wormhole-sdk'
import { ReactChild } from 'react'
import { ParsedTokenAccount } from 'src/store/transferSlice'
import { formatNativeDenom } from 'src/utils/bridgeUtils/terra'
import { Text } from '@pangolindex/components'

export default function SmartAddress({
  chainId,
  parsedTokenAccount,
  address,
  symbol,
  tokenName,
  variant,
  noGutter,
  noUnderline,
  extraContent
}: {
  chainId: ChainId
  parsedTokenAccount?: ParsedTokenAccount
  address?: string
  logo?: string
  tokenName?: string
  symbol?: string
  variant?: any
  noGutter?: boolean
  noUnderline?: boolean
  extraContent?: ReactChild
}) {
  const isNativeTerra = chainId === CHAIN_ID_TERRA && isNativeDenom(address)
  const useableSymbol = isNativeTerra ? formatNativeDenom(address) : parsedTokenAccount?.symbol || symbol || ''

  return (
    <div style={{ display: 'inline-block', margin: '5px' }}>
      <Text fontSize={15} fontWeight={300} lineHeight="20px" color="white">
        {useableSymbol}
      </Text>
    </div>
  )
}
