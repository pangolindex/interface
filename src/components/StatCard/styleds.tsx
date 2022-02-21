import { Box } from '@0xkilo/components'
import styled from 'styled-components'

export const Panel = styled(Box)`
  background-color: ${({ theme }) => theme.bg2};
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 25px;
  border-radius: 10px;
`

export const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  grid-column-gap: 40px;
`
