import { Box, Button } from '@pangolindex/components'
import { BlackCard } from 'src/components/Card'
import styled from 'styled-components'
import { ReactComponent as NightMode } from 'src/assets/svg/nightMode.svg'
import { ReactComponent as LightMode } from 'src/assets/svg/lightMode.svg'
import { ReactComponent as Wallet } from 'src/assets/svg/wallet.svg'
import { ReactComponent as Transaction } from 'src/assets/svg/transaction.svg'
import { CloseIcon, ExternalLink } from 'src/theme'
import CopyHelper from 'src/components/AccountDetails/Copy'

export const Frame = styled(Box)`
  z-index: 900;
  position: fixed;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.color2};

  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`

export const Items = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.color3};
  padding: 12px;
  gap: 15px;
  margin-bottom: 15px;
  border-radius: 5px;
`

export const ThemeMode = styled(BlackCard)`
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 4px;

  cursor: pointer;
`

export const TransactionButton = styled(BlackCard)`
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  cursor: pointer;
`

export const Line = styled.hr`
  height: 1px;
  width: 100%;
  background-color: ${({ theme }) => theme.color6};
  opacity: 0.1;
`

export const ToggleWalletButton = styled(Button)`
  gap: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  overflow: hidden;
`

export const LightModeIcon = styled(LightMode)`
  path {
    fill: ${({ color, theme }) => color || theme.text1};
  }
  width: 20px;
  height: 20px;
`

export const NightModeIcon = styled(NightMode)`
  path {
    fill: ${({ color, theme }) => color || theme.text1};
  }
  width: 20px;
  height: 20px;
`

export const WalletIcon = styled(Wallet)<{ color?: string }>`
  path {
    fill: ${({ color, theme }) => color || theme.text1};
  }
`

export const TransactionIcon = styled(Transaction)`
  path {
    fill: ${({ theme }) => theme.text1};
  }

  height: 20px;
  width: 20px;
`

export const AccountLink = styled(ExternalLink)`
  color: ${({ theme }) => theme.color22};
  height: 20px;
`

export const Copy = styled(CopyHelper)`
  height: 20px;

  path {
    fill: ${({ theme }) => theme.text1};
  }
`

export const TransactionState = styled(ExternalLink)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none !important;
  border-radius: 0.5rem;
  padding: 0.25rem 0rem;
  font-weight: 500;
  font-size: 0.825rem;

  color: ${({ theme }) => theme.primary};
`

export const CloseButton = styled(CloseIcon)`
  color: ${({ theme }) => theme.text1};
  position: absolute;
  right: 5px;
  top: 5px;
`
