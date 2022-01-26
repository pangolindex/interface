import React from 'react'
import { Text, Box } from '@pangolindex/components'
import { Currency } from '@pangolindex/sdk'
import { useCoinGeckoTokenData } from 'src/hooks/Tokens'
import { ExternalLink } from 'src/theme'
import ReactHtmlParser from 'react-html-parser'

interface Props {
  coin: Currency
}

export default function CoinInfo({ coin }: Props) {
  const { homePage, description } = useCoinGeckoTokenData(coin?.symbol, coin?.name)
  return (
    <>
      {(description || homePage) && (
        <Box>
          <Text color="text1" fontSize={16}>
            {coin?.name}
          </Text>

          <Text color="text1" fontSize={14}>
            {ReactHtmlParser(description)}
          </Text>

          <Box mt="5px">
            <ExternalLink style={{ color: 'white', textDecoration: 'underline' }} href={homePage} target="_blank">
              <Text color="text1" fontSize={16} fontWeight={500}>
                Visit Website
              </Text>
            </ExternalLink>
          </Box>
        </Box>
      )}
    </>
  )
}
