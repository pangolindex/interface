import styled from 'styled-components'
import { BlackCard } from '../../components/Card'
import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import { Text } from 'rebass'

export const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0 !important;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 0;
  display: block;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0;
        display: block;
  `}
`

export const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: flex-end;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.bg1};
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

export const FooterMobileControls = styled.div`
  display: none;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: row;
    display: flex;
    width: 100%
    justify-content: flex-end;
    justify-self: center;
    position: fixed;
    bottom: 0px;
    left: 0px;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.bg1};
  `};
`

export const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

export const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

export const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
  /* :hover {
    background-color: ${({ theme, active }) => (!active ? theme.bg2 : theme.bg4)};
  } */
`

export const PNGAmount = styled(AccountElement)`
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg3};
  background: radial-gradient(174.47% 188.91% at 1.84% 0%, #ffc800 0%, #e1aa00 100%), #edeef2;
`

export const PNGWrapper = styled.span`
  width: fit-content;
  position: relative;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
  :active {
    opacity: 0.9;
  }
`

export const NetworkCard = styled(BlackCard)`
  border-radius: 12px;
  padding: 8px 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

export const BalanceText = styled(Text)`
  color: ${({ theme }) => theme.text1};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

export const ThemeMode = styled(BlackCard)`
  border-radius: 0.5rem;
  padding: 0.15rem 0.6rem;
  margin-left: 0.5rem;
  cursor: pointer;
  height: 35px;
  line-height: 34px;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 10px;
    border: none;
    height: 45px;
    background-color: ${({ theme }) => theme.color7};
  `};
`

export const MobileHeader = styled.div`
  height: 80px;
  position: fixed;
  width: 100%;
  z-index: 2;
  background-color: ${({ theme }) => theme.bg2};
  padding: 10px;
  flex-direction: row;
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  display: flex;
  align-items: center;
`};
`

export const StyledMenuIcon = styled(MenuIcon)`
  cursor: pointer;
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`

export const MobileLogoWrapper = styled.div`
  flex: 1;
`

export const LegacyButtonWrapper = styled.div`
  display: block;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

export const CollapseBar = styled.div`
  position: absolute;
  top 40px;
  left: 3px;
  height: 60px;
  color: ${({ theme }) => theme.text2};
  line-height: 48px;
  text-align: center;
  cursor: pointer;
  background-color: ${({ theme }) => theme.bg6};
  width: '100%';
  transition: all 0.2s;
  display: none;
  transform: rotate(90deg);

  ${({ theme }) => theme.mediaWidth.upToMedium`
   display:block;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
   display:block;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
   display:block;
  `};
`
