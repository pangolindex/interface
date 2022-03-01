import React from 'react'
import styled from 'styled-components'
import { LineChart, Line } from 'recharts'
import { Box } from '@pangolindex/components'
import Logo from 'src/assets/images/logo.svg'

export const RowContainer = styled(Box)`
  padding: 12px;
  padding-bottom: 0px;

  &:hover {
    background: ${({ theme }) => theme.bg6};
    border-radius: 8px;
    cursor: pointer;
  }
`

export const Row = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.bg6};
`

export const TokenName = styled(Box)`
  display: flex;
  align-items: center;
  font-size: 20px;
  line-height: 30px;
  color: ${({ theme }) => theme.text7};

  span {
    margin-left: 6px;
  }
`

export const TokenMiniChart = styled(Box)`
  width: 60%;
  display: flex;
  justify-content: center;
`

export const TokenValue = styled(Box)`
  text-align: right;
`

export const TokenPrice = styled(Box)`
  font-size: 16px;
  line-height: 24px;

  color: ${({ theme }) => theme.text7};
`

export const TokenDiff = styled(Box)<{ isPositive: boolean }>`
  font-size: 10px;
  line-height: 15px;

  color: ${props => (props.isPositive ? '#18C145' : '#e84142')};
`

export interface TokenRowProps {
  name?: string
  diffPercent?: number
  onClick?: () => void
}

export default function TokenRow({ name = 'PNG', diffPercent = 1.68, onClick }: TokenRowProps) {
  const data = []

  const rand = 300
  for (let i = 0; i < 20; i += 1) {
    const d = {
      key: 2000 + i,
      value: Math.random() * (rand + 50) + 100
    }

    data.push(d)
  }

  return (
    <RowContainer>
      <Row onClick={onClick}>
        <TokenName>
          <img width={'28px'} src={Logo} alt={name} />
          <span>{name}</span>
        </TokenName>
        <TokenMiniChart>
          <LineChart width={82} height={18} data={data}>
            <Line type="monotone" dataKey="value" stroke={diffPercent >= 0 ? '#18C145' : '#E84142'} dot={false} />
          </LineChart>
        </TokenMiniChart>
        <TokenValue>
          <TokenPrice>${'122.74'}</TokenPrice>
          <TokenDiff isPositive={diffPercent >= 0}>
            {diffPercent >= 0 && '+'}
            {diffPercent}%
          </TokenDiff>
        </TokenValue>
      </Row>
    </RowContainer>
  )
}
