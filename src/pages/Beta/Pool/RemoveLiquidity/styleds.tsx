import { Box, TextInput } from '@pangolindex/components'
import styled from 'styled-components'

export const PageWrapper = styled(Box)`
  width: 100%;
  padding: 10px;
`

export const InputText = styled(TextInput)`
  background-color: ${({ theme }) => theme.bg6};
  padding: 15px;
  align-items: center;
  border-radius: 4px;
`

export const ContentBox = styled(Box)`
  width: 100%;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg6};
  margin-top: 10px;
  padding: 10px;
`

export const DataBox = styled(Box)`
  align-items: center;
  justify-content: space-between;
  display: flex;
  margin: 5px 0px 5px 0px;
`
