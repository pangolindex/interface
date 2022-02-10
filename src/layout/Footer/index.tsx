
import React, { useContext } from 'react'
import { Circle } from 'react-feather'
import { Box, Text } from '@pangolindex/components'
import { ThemeContext } from 'styled-components'

import { FooterFrame, Link, Policies } from './styled'

export default function Footer() {
  const theme = useContext(ThemeContext)
  return (
    <FooterFrame>
      <Policies>
        <Link href="/" as="a">
          Privacy Policy
        </Link>
        <Circle style={{ marginLeft: 10, marginRight: 10 }} size={5} stroke={theme.text1} fill={theme.text1} />
        <Link href="/" as="a">
          Terms of Service
        </Link>
        <Circle style={{ marginLeft: 10, marginRight: 10 }} size={5} stroke={theme.text1} fill={theme.text1} />
        <Link href="/" as="a">
          Cookie Policy
        </Link>
      </Policies>
      <Box display="flex">
        <Text color="text1">Powered by</Text>
        <Text color="mustardYellow" marginLeft='5px'> Pangolin DAO</Text>
      </Box>
    </FooterFrame>
  )
}
