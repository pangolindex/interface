import styled from 'styled-components'

export const Sider = styled.div<{ collapsed: boolean }>`
  overflow: hidden;
  height: 100vh;
  position: fixed;
  z-index: 99;
  right: 0;
  transition: width 350ms ease;
  background-color: ${({ theme }) => theme.color2};
  width: ${({ collapsed }) => (collapsed ? '0px' : '220px')};
  padding: ${({ collapsed }) => (collapsed ? '0px' : '10px')};
  display: flex;
  flex-direction: column;

  ${({ theme, collapsed }) => theme.mediaWidth.upToSmall`
  display: ${collapsed ? 'none' : 'flex'};
  width: 100%;
  height: 100%
  `};

  * {
    overflow-x: hidden !important;
  }
`
export const TopBar = styled.div<{ collapsed: boolean }>`
  left: 10px;
  right: 10px;
  z-index: 1;
  display: flex;
  position: relative;
  height: 30px;
  margin-top: 10px;
  margin-bottom: 20px;
  div {
    margin-top: ${({ collapsed }) => (collapsed ? '20px' : '0px')};
  }
`
export const LegacyButtonWrapper = styled.div`
  display: block;
  margin-bottom: 10px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`
