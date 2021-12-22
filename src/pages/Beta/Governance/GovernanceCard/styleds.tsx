import { Box, Button } from '@pangolindex/components'
import styled from 'styled-components'

export const Card = styled(Box)`
  width: 100%;
  background: ${({ theme }) => theme.bg2};
  border-radius: 8px;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  background-color: ${({ theme }) => theme.bg2} !important;
  border: solid 1px ${({ theme }) => theme.text1} !important;
  font-size: 21px;
  font-weight: normal !important;
  line-height: 25px;
  border-radius: 8px !important;
  margin-right: 22px;
  width: 157px !important;
  height: 46px !important;
`

export const VoteButton = styled(Button)`
  font-size: 21px;
  font-weight: normal !important;
  line-height: 25px;
  border-radius: 8px !important;
  width: 157px !important;
  height: 46px !important;
  text-transform: capitalize;
`
