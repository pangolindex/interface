import styled from 'styled-components'
import { Box, Text } from '@pangolindex/components'
import { CloseIcon } from 'src/theme'

export const FooterFrame = styled.footer`
  width: 100%;
  height: 50px;
  display: grid;
  grid-template-columns: 75% 25%;
  align-items: center;
  background-color: ${({ theme }) => theme.color2};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
  `};
`

export const Policies = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-content: center;
  `};
`

export const Button = styled(Text)`
  color: ${({ theme }) => theme.text1};
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

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    height: 100%;
  `};
`

export const PolicyText = styled(Box)`
  width: 100%;
  color: ${({ theme }) => theme.text1};
  & a {
    color: ${({ theme }) => theme.text1};
  }
  overflow-x: hidden;
`
