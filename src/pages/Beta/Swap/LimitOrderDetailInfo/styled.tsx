import { Box, Text } from '@0xkilo/components'
import styled from 'styled-components'

export const ContentBox = styled(Box)`
  background-color: ${({ theme }) => theme.bg6};
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
`
export const DataBox = styled(Box)`
  align-items: center;
  justify-content: space-between;
  display: flex;
  margin: 5px 0px 5px 0px;
`
export const ValueText = styled(Text)<{ severity?: -1 | 0 | 1 | 2 | 3 | 4 }>`
  color: ${({ theme, severity }) =>
    severity === 3 || severity === 4
      ? theme.red1
      : severity === 2
      ? theme.yellow2
      : severity === 1
      ? theme.text1
      : severity === 0
      ? theme.green1
      : theme.text4};
`
