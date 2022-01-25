import styled from 'styled-components'

export const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  cursor: pointer;
  overflow: hidden !important;
`

export const LogoWrapper = styled.div<{ collapsed: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
`
