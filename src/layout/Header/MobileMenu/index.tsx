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
import { MenuLinks } from '../../Sidebar/MenuLinks'
import SocialMedia from 'src/layout/SocialMedia'
import { Box, useTranslation } from '@pangolindex/components'
import { Scrollbars } from 'react-custom-scrollbars'
import { useDarkModeManager } from 'src/state/user/hooks'
import LanguageSelection from 'src/components/LanguageSelection'
import { MobileHeader } from '../MobileHeader'
import Footer from 'src/layout/Footer'
import MobileWeb3Status from './MobileWeb3Status'
import TransactionModal from './TransactionModal'
import Modal from 'src/components/Beta/Modal'
import { MENU_LINK } from 'src/constants'
import { ANALYTICS_PAGE } from '../../../constants'
import { Dashboard, Swap, Stake, Pool, Buy, Vote, Airdrop } from '../../../components/Icons'
import ChartsIcon from '../../../assets/svg/menu/analytics.svg'
import BridgeIcon from '../../../assets/svg/menu/bridge.svg'
import GovernanceIcon from '../../../assets/svg/menu/governance.svg'

interface Props {
  activeMobileMenu: boolean
  handleMobileMenu: () => void
}

const MobileMenu: React.FC<Props> = ({ activeMobileMenu, handleMobileMenu }) => {
  const [isDark, toggleDarkMode] = useDarkModeManager()

  const [openTransactions, setOpenTransactions] = useState(false)

  const { t } = useTranslation()

  const onCloseTransactions = () => {
    setOpenTransactions(false)
  }

  const location: any = useLocation()

  const mainLinks = [
    {
      link: MENU_LINK.dashboard,
      icon: Dashboard,
      title: t('header.dashboard'),
      id: 'dashboard',
      isActive: location?.pathname?.startsWith(MENU_LINK.dashboard)
    },
    {
      link: MENU_LINK.swap,
      icon: Swap,
      title: t('header.swap'),
      id: 'swap',
      isActive: location?.pathname?.startsWith(MENU_LINK.swap)
    },
    {
      link: MENU_LINK.buy,
      icon: Buy,
      title: t('header.buy'),
      id: 'buy',
      isActive: location?.pathname?.startsWith(MENU_LINK.buy)
    },
    {
      link: MENU_LINK.pool,
      icon: Pool,
      title: `${t('header.pool')} & ${t('header.farm')}`,
      id: 'pool',
      isActive: location?.pathname?.startsWith(MENU_LINK.pool)
    },
    {
      link: `${MENU_LINK.stake}/0`,
      icon: Stake,
      title: t('header.stake'),
      id: 'stake',
      isActive: location?.pathname?.startsWith(`${MENU_LINK.stake}/`)
    },
    {
      link: MENU_LINK.stakev2,
      icon: Stake,
      title: `${t('header.stake')} V2`,
      id: 'stakev2',
      isActive: location?.pathname?.startsWith(MENU_LINK.stakev2)
    },

    {
      link: MENU_LINK.vote,
      icon: Vote,
      title: t('header.vote'),
      id: 'vote',
      isActive: location?.pathname?.startsWith(MENU_LINK.vote)
    },
    {
      link: MENU_LINK.airdrop,
      icon: Airdrop,
      title: 'Airdrop',
      id: 'airdrop',
      isActive: location?.pathname?.startsWith(MENU_LINK.airdrop)
    }
  ]

  const pangolinLinks = [
    {
      link: ANALYTICS_PAGE,
      icon: ChartsIcon,
      title: t('header.charts'),
      id: 'charts'
    },
    {
      link: 'https://gov.pangolin.exchange',
      icon: GovernanceIcon,
      title: t('header.forum'),
      id: 'forum'
    }
  ]

  const otherLinks = [
    {
      link: 'https://bridge.avax.network/',
      icon: BridgeIcon,
      title: `Avalanche ${t('header.bridge')}`,
      id: 'bridge'
    },
    {
      link: 'https://satellite.axelar.network/',
      icon: BridgeIcon,
      title: `Satellite ${t('header.bridge')}`,
      id: 'satellite-bridge'
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
