import styled from 'styled-components'

export const Sider = styled.div<{ collapsed: boolean }>`
  overflow: hidden;
  height: 100vh;
  position: absolute;
  z-index: 99;
  transition: width 350ms ease;
  background-color: ${({ theme }) => theme.bg2};
  width: ${({ collapsed }) => (collapsed ? '100%' : '0%')};
  padding: ${({ collapsed }) => (collapsed ? '10px' : '0px')};
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 10px;
  height: 100%;

  ${({ theme, collapsed }) => theme.mediaWidth.upToSmall`
  display: ${collapsed ? 'none' : 'flex'};
  width: 100%;
  height: 100%
  `};

  * {
    overflow-x: hidden !important;
  }
`

export const MenuWrapper = styled.div`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`
