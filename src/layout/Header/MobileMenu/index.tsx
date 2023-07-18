import React, { useState } from 'react'
import {
  Frame,
  LightModeIcon,
  NightModeIcon,
  TransactionButton,
  TransactionIcon,
  Items,
  Line,
  ThemeMode,
  Wrapper
} from './styled'
import { MenuLinks } from '../../Sidebar/MenuLinks'
import SocialMedia from 'src/layout/SocialMedia'
import { Box, Modal } from '@pangolindex/components'
import { Scrollbars } from 'react-custom-scrollbars'
import { useDarkModeManager } from 'src/state/user/hooks'
import LanguageSelection from 'src/components/LanguageSelection'
import { MobileHeader } from '../MobileHeader'
import Footer from 'src/layout/Footer'
import TransactionModal from './TransactionModal'
import SwitchSubgraph from 'src/components/SwitchSubgraph'

interface Props {
  activeMobileMenu: boolean
  handleMobileMenu: () => void
}

const MobileMenu: React.FC<Props> = ({ activeMobileMenu, handleMobileMenu }) => {
  const [isDark, toggleDarkMode] = useDarkModeManager()

  const [openTransactions, setOpenTransactions] = useState(false)

  const onCloseTransactions = () => {
    setOpenTransactions(false)
  }

  return (
    <Frame>
      <Scrollbars>
        <MobileHeader activeMobileMenu={activeMobileMenu} handleMobileMenu={handleMobileMenu} />
        <Box display="flex" flexDirection="column" padding="15px">
          <Line />
          <Items>
            <Wrapper width="100%" justifyContent="center">
              <TransactionButton onClick={() => setOpenTransactions(true)}>
                <Box width="20px" height="20px">
                  <TransactionIcon />
                </Box>
              </TransactionButton>
              <LanguageSelection />
              <ThemeMode onClick={() => toggleDarkMode()}>
                <Box width="20px" height="20px">
                  {isDark ? <LightModeIcon /> : <NightModeIcon />}
                </Box>
              </ThemeMode>
            </Wrapper>
          </Items>
          <Box style={{ flexGrow: 1 }}>
            <MenuLinks onClick={handleMobileMenu} />
          </Box>
          <SwitchSubgraph />
          <Box width="100%" marginBottom="20px" marginTop="20px">
            <SocialMedia collapsed={false} />
          </Box>
          <Footer />
        </Box>
      </Scrollbars>
      <Modal isOpen={openTransactions} onDismiss={onCloseTransactions}>
        <TransactionModal onClose={onCloseTransactions} />
      </Modal>
    </Frame>
  )
}

export default MobileMenu
