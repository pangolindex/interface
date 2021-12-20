import { Box, Button } from '@pangolindex/components'
import styled from 'styled-components'

export const Card = styled(Box)`
  width: 100%;
  background: ${({ theme }) => theme.bg2};
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

export const VoteButton = styled(Button)<{ bg: string }>`
  // border: solid 1px ${({ theme }) => theme.text1} !important;
  background-color: ${props => {
    if (props.bg === 'Vote') {
      return '#E67826'
    } else if (props.bg === 'Executed') {
      return 'rgba(24, 193, 69, 0.3)'
    } else if (props.bg === 'Rejected') {
      return 'rgba(232, 65, 66, 0.3)'
    } else {
      return 'rgba(230, 120, 38, 0.3)'
    }
  }} !important;
  color: ${props => {
    if (props.bg === 'Vote') {
      return '#E6E9EC'
    } else if (props.bg === 'Executed') {
      return '#18C145'
    } else if (props.bg === 'Rejected') {
      return '#E84142'
    } else {
      return '#E6E9EC'
    }
  }} !important;
  font-size: 21px;
  font-weight: normal !important;
  line-height: 25px;
  border-radius: 8px !important;
  width: 157px !important;
  height: 46px !important;
`
