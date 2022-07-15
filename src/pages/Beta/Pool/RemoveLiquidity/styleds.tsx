import { Box, TextInput } from '@pangolindex/components'
import styled from 'styled-components'

export const RemoveWrapper = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const InputText = styled(TextInput)`
  background-color: ${({ theme }) => theme.bg6};
  padding: 15px;
  align-items: center;
  border-radius: 4px;
`
