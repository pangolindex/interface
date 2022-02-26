import { Box, Button } from '@0xkilo/components'
import styled from 'styled-components'

export const Panel = styled(Box)`
  background-color: ${({ theme }) => theme.bg2};
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 20px;
  border-radius: 10px;
`

export const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  grid-column-gap: 40px;
`
export const OptionButton = styled.div<{ active?: boolean; disabled?: boolean }>`
  font-weight: 500;
  width: fit-content;
  white-space: nowrap;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.bg4};
  background-color: ${({ active, theme }) => (active ? theme.yellow2 : theme.bg7)};
  color: ${({ theme }) => theme.text1};

  :hover {
    cursor: ${({ disabled }) => !disabled && 'pointer'};
  }
`

export const OptionsWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto;
  grid-gap: 10px;
`

export const Divider = styled(Box)`
  height: 1px;
  background-color: ${({ theme }) => theme.bg7};
  margin: 10px 0px 10px 0px;
  width: 100%;
`

export const MigrateButton = styled(Button)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

export const InnerWrapper = styled(Box)`
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #2c2d33;
  border-radius: 4px;
  padding: 10px;
  margin-top: 10px;
`
