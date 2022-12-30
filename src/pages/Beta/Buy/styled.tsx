import { Button } from '@pangolindex/components'
import styled from 'styled-components'
import { ReactComponent as Wallet } from 'src/assets/svg/wallet.svg'

export const ToggleWalletButton = styled(Button)`
  gap: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

export const WalletIcon = styled(Wallet)<{ color?: string }>`
  path {
    fill: ${({ color, theme }) => color || theme.text1};
  }
`
