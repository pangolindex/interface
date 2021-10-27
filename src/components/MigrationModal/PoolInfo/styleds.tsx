import styled from 'styled-components'
import { Box } from '@pangolindex/components'

export const InfoWrapper = styled.div`
  margin: 0;
  width: 100%;
`

export const ContentBox = styled(Box)`
  background-color: ${({ theme }) => theme.bg6};
  padding: 15px;
  border-radius: 4px;
`

export const DataBox = styled(Box)`
  align-items: center;
  justify-content: space-between;
  display: flex;
  margin: 5px 0px 5px 0px;
`

export const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`
