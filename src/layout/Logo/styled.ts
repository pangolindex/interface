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
  }
`

export const PngIcon = styled.div`
  transition: transform 0.3s ease;
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
