import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const PageWrapper = styled(Box)`
  width: 100%;
`
export const Root = styled(Box)`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0px 10px;
`
export const RewardWrapper = styled(Box)`
  display: grid;
  grid-template-columns: minmax(auto, 50%) minmax(auto, 50%);
  grid-gap: 8px;
  justify-content: center;
`
