import React from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'
import { AlertTriangle } from 'react-feather'
import { RowFixed } from '../Row'
import { AutoColumn } from '../Column'

const WarningWrapper = styled.div`
  border-radius: 20px;
  border: 1px solid #f82d3a;
  background: rgba(248, 45, 58, 0.05);
  padding: 1rem;
  color: #f82d3a;
  position: relative;
  @media screen and (max-width: 800px) {
    width: 80% !important;
    margin-left: 5%;
  }
`

const StyledWarningIcon = styled(AlertTriangle)`
  min-height: 20px;
  min-width: 20px;
  stroke: red;
`

const ConvertLink = styled.a`
  color: #ed147a;
  text-decoration: none;
`

export function DeprecatedWarning() {
  return (
    <WarningWrapper>
      <AutoColumn gap="4px">
        <RowFixed>
          <StyledWarningIcon />
          <Text fontWeight={600} lineHeight={'145.23%'} ml={'10px'}>
            Old AEB tokens Alert
          </Text>
        </RowFixed>
        <Text fontWeight={500} lineHeight={'145.23%'} mt={'10px'}>
          Please note these tokens were used by the old AEB bridge and have been deprecated. Using these tokens may
          result in unexpected behaviour and is not recommended. If you still hold old AEB tokens, please convert them
          here{' '}
          <ConvertLink href={'https://bridge.avax.network/convert'} target="_blank">
            https://bridge.avax.network/convert
          </ConvertLink>
        </Text>
      </AutoColumn>
    </WarningWrapper>
  )
}
