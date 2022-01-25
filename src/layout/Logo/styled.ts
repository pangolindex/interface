import styled from 'styled-components'

export const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
    overflow: hidden !important;
  }
`

export const PngIcon = styled.div`
  transition: transform 0.3s ease;
  overflow: hidden !important;
  :hover {
    transform: rotate(-5deg);
  }
`

export const LogoWrapper = styled.div<{ collapsed: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
`
