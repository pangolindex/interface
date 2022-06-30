import styled from 'styled-components'
import { ExternalLink } from '../../theme'

export const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  width: 100%;
  padding: 10px;
  color: ${({ theme }) => theme.text2};
  text-align: center;
  background-color: ${({ theme }) => theme.bg6};
  margin-bottom: 10px;
`

export const IconWrapper = styled.div<{ collapsed: boolean }>`
  display: flex;
  justify-content: center;
  flex-direction: ${({ collapsed }) => (collapsed ? 'column' : 'row')};
  align-items: center;
  margin: 5px 0px 10px 0px;
`

export const Icon = styled.img`
  margin-right: 5px;
  margin-top: 5px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 24px;
  `};
`

export const Link = styled(ExternalLink)`
  ${({ theme }) => theme.flexRowNoWrap}

  cursor: pointer;
  text-decoration: none;
`
