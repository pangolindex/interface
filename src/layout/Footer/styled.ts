import styled from 'styled-components'
import { Box, Text } from '@pangolindex/components'
import { CloseIcon } from 'src/theme'

export const FooterFrame = styled.footer`
  width: 100%;
  height: 50px;
  display: grid;
  grid-template-columns: minmax(auto, 85%) minmax(auto, 15%);
  align-items: center;
  background-color: ${({ theme }) => theme.color2};
`

export const Policies = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`

export const Button = styled(Text)`
  color: ${({ theme }) => theme.text1};
  font-size: 14px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`

export const CloseButton = styled(CloseIcon)`
  color: ${({ theme }) => theme.text1};
  position: absolute;
  right: 9px;
  top: 9px;
`

export const Content = styled(Box)`
  width: 70vw;
  height: 70vh;
  padding: 30px;
`

export const PolicyText = styled(Box)`
  margin: 10px;
  color: ${({ theme }) => theme.text1};
  & a {
    color: ${({ theme }) => theme.text1};
  }
`
