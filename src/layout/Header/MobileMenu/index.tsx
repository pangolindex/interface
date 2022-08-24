import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
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
import { MenuLinks } from 'src/layout/Sidebar/MenuLinks'
import SocialMedia from 'src/layout/SocialMedia'
import { Box, useTranslation } from '@pangolindex/components'
import { Scrollbars } from 'react-custom-scrollbars'
import { useDarkModeManager } from 'src/state/user/hooks'
import LanguageSelection from 'src/components/LanguageSelection'
import { MobileHeader } from 'src/layout/Header/MobileHeader'
import Footer from 'src/layout/Footer'
import MobileWeb3Status from './MobileWeb3Status'
import TransactionModal from './TransactionModal'
import Modal from 'src/components/Beta/Modal'
import { MENU_LINK } from 'src/constants'
import { externalLinks, internalLinks } from 'src/layout/Header/MenuItems'

interface Props {
  activeMobileMenu: boolean
  handleMobileMenu: () => void
}

const MobileMenu: React.FC<Props> = ({ activeMobileMenu, handleMobileMenu }) => {
  const [isDark, toggleDarkMode] = useDarkModeManager()

  const [openTransactions, setOpenTransactions] = useState(false)

  const { t } = useTranslation()
  const location = useLocation()

  const onCloseTransactions = () => {
    setOpenTransactions(false)
  }

  const mainLinks = [
    {
      ...internalLinks.Dashboard,
      title: t('header.dashboard'),
      isActive: location?.pathname?.startsWith(MENU_LINK.dashboard)
    },
    {
      ...internalLinks.Swap,
      title: t('header.swap'),
      isActive: location?.pathname?.startsWith(MENU_LINK.swap)
    },
    {
      ...internalLinks.Buy,
      title: t('header.buy'),
      isActive: location?.pathname?.startsWith(MENU_LINK.buy)
    },
    {
      ...internalLinks.Pool,
      title: `${t('header.pool')} & ${t('header.farm')}`,
      isActive: location?.pathname?.startsWith(MENU_LINK.pool)
    },
    {
      ...internalLinks.Stake,
      title: t('header.stake'),
      isActive: location?.pathname?.startsWith(`${MENU_LINK.stake}/`)
    },
    {
      ...internalLinks.StakeV2,
      title: `${t('header.stake')} V2`,
      isActive: location?.pathname?.startsWith(MENU_LINK.stakev2)
    },
    {
      ...internalLinks.Vote,
      title: t('header.vote'),
      isActive: location?.pathname?.startsWith(MENU_LINK.vote)
    },
    {
      ...internalLinks.Airdrop,
      title: 'Airdrop',
      isActive: location?.pathname?.startsWith(MENU_LINK.airdrop)
    }
  ]

  const pangolinLinks = [
    {
      ...externalLinks.Charts,
      title: t('header.charts')
    },
    {
      ...externalLinks.Forum,
      title: t('header.forum')
    }
  ]

  const otherLinks = [
    {
      ...externalLinks.AvalancheBridge,
      title: `Avalanche ${t('header.bridge')}`
    },
    {
      ...externalLinks.SatelliteBridge,
      title: `Satellite ${t('header.bridge')}`
    }
  ]

  return (
    <Frame>
      <Scrollbars>
        <MobileHeader activeMobileMenu={activeMobileMenu} handleMobileMenu={handleMobileMenu} />
        <Box display="flex" flexDirection="column" padding="15px">
          <Line />
          <Items>
            <Box width="100%">
              <MobileWeb3Status />
            </Box>
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
            <MenuLinks
              onClick={handleMobileMenu}
              mainLinks={mainLinks}
              pangolinLinks={pangolinLinks}
              otherLinks={otherLinks}
            />
          </Box>
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
