import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const WithdrawWrapper = styled(Box)`
  width: 100%;
  height: 100%;
  padding: 10px;
`
export const Root = styled(Box)`
  height: 100%;
  display: flex;
  flex-direction: column;
`
export const RewardWrapper = styled(Box)`
  display: grid;
  grid-template-columns: minmax(auto, 50%) minmax(auto, 50%);
  grid-gap: 8px;
  justify-content: center;
  height: 100%;
`
export const StatWrapper = styled(Box)`
  text-align: center;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`
