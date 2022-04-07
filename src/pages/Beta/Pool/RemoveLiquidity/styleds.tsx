import { Box, TextInput } from '@antiyro/components'
import styled from 'styled-components'

export const RemoveWrapper = styled(Box)`
  width: 100%;
  padding: 10px;
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

export const ContentBox = styled(Box)`
  width: 100%;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg6};
  margin-top: 10px;
  padding: 6px;
  display: grid;
  grid-template-columns: minmax(auto, 50%) minmax(auto, 50%);
  grid-gap: 12px;
  text-align: center;
`
