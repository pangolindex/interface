import styled from 'styled-components'
import { Box } from '@antiyro/components'

export const Wrapper = styled.div`
  margin: 0;
  width: 100%;
`
export const PairBox = styled(Box)`
  background-color: ${({ theme }) => theme.bg6};
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.text2};
  margin: 5px 0px 5px 0px;
  cursor: pointer;
`
