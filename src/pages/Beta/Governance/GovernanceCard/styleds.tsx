import { Box, Button, Text } from '@pangolindex/components'
import styled from 'styled-components'

export const Card = styled(Box)`
  width: 100%;
  background: ${({ theme }) => theme.bg2};
  border-radius: 8px;
  padding: 30px;
  display: grid;
  grid-template-columns: minmax(auto, 65%) minmax(auto, 35%);
  grid-gap: 12px;
  align-items: center;
  margin-top: 22px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 100%;
  `};
`

export const CardTitle = styled(Box)`
  display: flex;
`

export const CardButtons = styled(Box)`
  display: -webkit-box;
  // justify-content: space-between;
`

export const DetailsButton = styled(Button)`
  background-color: ${({ theme }) => theme.color2} !important;
  border: solid 1px ${({ theme }) => theme.color4} !important;
  color: ${({ theme }) => theme.color4} !important;
  font-size: 21px;
  font-weight: normal !important;
  line-height: 25px;
  border-radius: 8px !important;
  margin-right: 22px;
  width: 157px !important;
  height: 46px !important;

  ${({ theme }) => theme.mediaWidth.upToSmall`
      width: 100px !important;
      height: 40px !important;
      font-size: 16px;
  `};
`

export const VoteButton = styled(Button)`
  font-size: 21px;
  font-weight: normal !important;
  line-height: 25px;
  border-radius: 8px !important;
  width: 157px !important;
  height: 46px !important;
  text-transform: capitalize;
  ${({ theme }) => theme.mediaWidth.upToSmall`
      width: 100px !important;
      height: 40px !important;
      font-size: 16px;
  `};
`

export const Number = styled(Text)`
  font-size: 28px;
  line-height: 42px;
  margin-right: 21px;
  color: ${({ theme }) => theme.text10};
  ${({ theme }) => theme.mediaWidth.upToSmall`
     font-size: 16px;
     line-height: 20px;
  `};
`

export const Title = styled(Text)`
  font-size: 28px;
  line-height: 42px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.text10};
  ${({ theme }) => theme.mediaWidth.upToSmall`
      font-size: 16px;
      line-height: 20px;
      white-space: break-spaces;
      overflow: initial;
  `};
`
