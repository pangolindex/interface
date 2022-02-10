import styled from 'styled-components'
import { Text } from '@pangolindex/components'

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

export const Link = styled(Text)`
  color: ${({ theme }) => theme.text1};
  text-decoration: none;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
`
