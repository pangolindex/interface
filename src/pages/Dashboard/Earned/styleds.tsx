import { Box, Button } from '@antiyro/components'
import styled from 'styled-components'

// earned section
export const Label = styled(Box)`
  font-size: 14px;
  line-height: 21px;
  color: #717171;
  margin-top: 12px;
`

export const Value = styled(Box)`
  font-size: 24px;
  line-height: 36px;

  color: ${({ theme }) => theme.text7};
  display: flex;
  align-items: center;

  img {
    margin-left: 9px;
  }
`

export const ValueWithInfo = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`

export const XStakeButton = styled(Button)`
  height: 46px;
  margin-right: 8.5px;
  box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
`

export const ClaimButton = styled(Button)`
  height: 46px;
`

export const CustomizePools = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 8.5px;

  a {
    color: ${({ theme }) => theme.text8};
  }
`
