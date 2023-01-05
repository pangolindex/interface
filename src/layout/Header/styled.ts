import styled from 'styled-components'
import { BlackCard } from '../../components/Card'
import { Text } from 'rebass'

export const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 0;
    width: calc(100%);
    position: relative;
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
    background-color: ${theme.bg1};
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
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
  cursor: pointer;
  width: max-content;
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.bg3};
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
  border-radius: 4px;
  padding: 10px 12px;
  margin-left: 0.5rem;
  cursor: pointer;
  /* height: 35px; */
  line-height: 20px;
  display: flex;

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
    background-color: ${theme.color7};
  `};
`

export const MobileHeaderFrame = styled.div`
  height: 80px;
  width: 100%;
  z-index: 2;
  background-color: ${({ theme }) => theme.bg2};
  padding: 25px;
  flex-direction: row;
  display: flex;
  align-items: center;
`

export const MobileLogoWrapper = styled.div`
  flex: 1;
`

export const LegacyButtonWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

export const SupportButton = styled.a`
  background-color: ${({ theme }) => theme.color2};
  color: ${({ theme }) => theme.text1};
  text-decoration: none;
  border-radius: 12px;
  padding: 8px 12px;
  width: max-content;
  display: flex;
  justify-content: center;
`

//https://codepen.io/tt0113243/pen/oexJzE
export const IconMenu = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 29px;
  height: 29px;
  border-radius: 29px;
  padding: 8px;
  background-color: ${({ theme }) => theme.primary1};
  cursor: pointer;

  .dot {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 3px;
    height: 3px;
    background-color: ${({ theme }) => theme.black};
    border-radius: 3px;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    -webkit-transition: margin 0.4s ease 0.4s, width 0.4s ease;
    -moz-transition: margin 0.4s ease 0.4s, width 0.4s ease;
    -o-transition: margin 0.4s ease 0.4s, width 0.4s ease;
    transition: margin 0.4s ease 0.4s, width 0.4s ease;
  }

  .dot:nth-of-type(1) {
    margin-top: -6px;
    margin-left: -6px;
    -webkit-transform: translate(-50%, -50%) rotate(45deg);
    -moz-transform: translate(-50%, -50%) rotate(45deg);
    -ms-transform: translate(-50%, -50%) rotate(45deg);
    -o-transform: translate(-50%, -50%) rotate(45deg);
    transform: translate(-50%, -50%) rotate(45deg);
  }

  .dot:nth-of-type(2) {
    margin-top: -6px;
    -webkit-transform: translate(-50%, -50%) rotate(-45deg);
    -moz-transform: translate(-50%, -50%) rotate(-45deg);
    -ms-transform: translate(-50%, -50%) rotate(-45deg);
    -o-transform: translate(-50%, -50%) rotate(-45deg);
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  .dot:nth-of-type(3) {
    margin-top: -6px;
    margin-left: 6px;
  }

  .dot:nth-of-type(4) {
    margin-left: -6px;
  }

  .dot:nth-of-type(6) {
    margin-left: 6px;
  }
  .dot:nth-of-type(7) {
    margin-top: 6px;
    margin-left: -6px;
  }

  .dot:nth-of-type(8) {
    margin-top: 6px;
  }
  .dot:nth-of-type(9) {
    margin-top: 6px;
    margin-left: 6px;
  }

  &.clicked .dot {
    -webkit-transition: margin 0.4s ease, width 0.4s ease 0.4s;
    -moz-transition: margin 0.4s ease, width 0.4s ease 0.4s;
    -o-transition: margin 0.4s ease, width 0.4s ease 0.4s;
    transition: margin 0.4s ease, width 0.4s ease 0.4s;
    margin-left: 0;
    margin-top: 0;
  }

  &.clicked .dot:nth-of-type(1) {
    width: 23px;
  }

  &.clicked .dot:nth-of-type(2) {
    width: 23px;
  }
`
export const Logo = styled.img`
  border-radius: 20px;
  height: 18px;
  width: 18px;
  margin-right: 10px;
`
