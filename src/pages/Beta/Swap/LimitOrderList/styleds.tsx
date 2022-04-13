import { Box } from '@pangolindex/components'
import styled from 'styled-components'

export const DesktopLimitOrderList = styled(Box)`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  padding: 20px;
  background-color: ${({ theme }) => theme.color2};
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

export const GridContainer = styled(Box)`
  display: grid;
  grid-template-columns: minmax(auto, 50%) 50%;
  grid-gap: 8px;
  padding: 10px 0px;
  flex: 1;
`

export const Divider = styled(Box)`
  height: 1px;
  background-color: ${({ theme }) => theme.bg7};
  margin: 10px 0px 10px 0px;
  width: 100%;
`

export const CoinList = styled(Box)`
  max-height: 200px;
  overflow-y: auto;
`

// WatchList Row Styles
export const DesktopRowWrapper = styled(Box)<{ isSelected: boolean }>`
  padding: 0px 10px;
  /* display: grid;
  grid-template-columns: 100px minmax(auto, 1fr) max-content; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.text9};
  cursor: pointer;
  border-radius: 4px;
  background-color: ${({ theme, isSelected }) => (isSelected ? theme.color3 : theme.color2)};

  height: 64px;

  &:hover {
    background-color: ${({ theme }) => theme.color3};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`
export const DeleteButton = styled.button`
  background-image: linear-gradient(to right, rgba(255, 0, 0, 0), ${({ theme }) => theme.bg6});
  background-color: transparent;
  border: 0px;
  color: ${({ theme }) => theme.text1};
  cursor: pointer;
  display: block;
  height: 64px;
  width: 100%;
  position: absolute;
`

// Coin Chart Styles

export const SelectedCoinInfo = styled(Box)`
  display: grid;
  grid-template-columns: max-content auto max-content;
  grid-gap: 8px;
  align-items: center;
`

export const DurationBtns = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
export const StatWrapper = styled(Box)`
  display: grid;
  grid-template-columns: minmax(auto, 50%) minmax(auto, 50%);
  grid-gap: 12px;
  margin-top: 10px;
`

export const MobileLimitOrderList = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  padding: 20px;
  background-color: ${({ theme }) => theme.color2};
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  display: block;
`};
`

export const MobileRowWrapper = styled(Box)<{ isSelected: boolean }>`
  padding: 10px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.text9};
  cursor: pointer;
  border-radius: 4px;
  background-color: ${({ theme, isSelected }) => (isSelected ? theme.color3 : theme.color2)};
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
  `};
`
