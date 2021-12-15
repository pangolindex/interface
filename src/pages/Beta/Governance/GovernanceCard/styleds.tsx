import { Box, Button } from '@pangolindex/components'
import styled from 'styled-components'

export const Card = styled(Box)`
  width: 100%;
  background: #111111;
  border-radius: 8px;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  margin-top: 22px;
`

export const CardTitle = styled(Box)`
  display: flex;
`

export const CardButtons = styled(Box)`
  display: flex;
  justify-content: space-between;
`

export const DetailsButton = styled(Button)`
  background-color: ${({ theme }) => theme.bg8} !important;
  border-radius: 4px !important;
  margin-right: 22px;
  width: 157px !important;
  height: 46px !important;
`

export const VoteButton = styled(Button)`
  border: solid 1px ${({ theme }) => theme.text1} !important;
  border-radius: 4px !important;
  width: 157px !important;
  height: 46px !important;
`
