import React, { useContext } from 'react'
import { MENU_LINK } from 'src/constants'
import { ThemeContext } from 'styled-components'
import { Menu, MenuItem, MenuLink, MenuName, MenuExternalLink, MenuWrapper } from './styled'
import { Box, existSarContract, Text, useTranslation } from '@pangolindex/components'
import { Dashboard, Swap, Stake, Pool, Buy, Vote, Airdrop } from '../../components/Icons'
import Charts from '../../assets/svg/menu/analytics.svg'
import { ANALYTICS_PAGE } from '../../constants'
import Bridge from '../../assets/svg/menu/bridge.svg'
import Governance from '../../assets/svg/menu/governance.svg'
import { useLocation } from 'react-router-dom'
import { useChainId } from 'src/hooks'
import { CHAINS } from '@pangolindex/sdk'
import { VOTE_PAGE_ACCESS } from 'src/constants/accessPermissions'

interface Props {
  collapsed?: boolean
  onClick?: () => void
}

interface Link {
  link: string
  icon: string
  title: string
  id: string
}

export const MenuLinks: React.FC<Props> = ({ collapsed = false, onClick }) => {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()
  const chainId = useChainId()
  const chain = CHAINS[chainId]

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

  // for now, for non evm chain, hide all other menus except dashboard and swap
  if (!chain.evm) {
    mainLinks.splice(4)
  }

  if (!VOTE_PAGE_ACCESS[chainId]) {
    const votePageIndex = mainLinks.findIndex(element => {
      if (element?.id === 'vote') return true

      return false
    })

    mainLinks.splice(votePageIndex, 1)
  }

  // remove stakvev2 if not exist sar contract
  if (!existSarContract(chainId)) {
    const stakeV2PageIndex = mainLinks.findIndex(element => {
      if (element?.id === 'stakev2') return true

      return false
    })

    mainLinks.splice(stakeV2PageIndex, 1)
  }

  const pangolinLinks = [
    {
      link: ANALYTICS_PAGE,
      icon: Charts,
      title: t('header.charts'),
      id: 'charts'
    },
    {
      link: 'https://gov.pangolin.exchange',
      icon: Governance,
      title: t('header.forum'),
      id: 'forum'
    }
  ]

  const otherLinks = [
    {
      link: 'https://bridge.avax.network/',
      icon: Bridge,
      title: `Avalanche ${t('header.bridge')}`,
      id: 'bridge'
    },
    {
      link: 'https://satellite.axelar.network/',
      icon: Bridge,
      title: `Satellite ${t('header.bridge')}`,
      id: 'satellite-bridge'
    }
  ]

  const createMenuLink = (link: Link, index: number) => {
    return (
      <MenuItem key={index}>
        <MenuExternalLink id={link.id} href={link.link}>
          <img src={link.icon} width={16} alt={link.title} />
          {!collapsed && <MenuName fontSize={[16, 14]}>{link.title}</MenuName>}
        </MenuExternalLink>
      </MenuItem>
    )
  }

  return (
    <MenuWrapper>
      <Menu>
        {mainLinks.map((x, index) => {
          const Icon = x.icon

          return (
            <MenuItem isActive={x.isActive} key={index}>
              <MenuLink id={x.id} to={x.link} onClick={onClick}>
                <Icon size={16} fillColor={x.isActive ? theme.black : theme.color22} />
                {!collapsed && (
                  <MenuName fontSize={[16, 14]} color={x.isActive ? 'black' : undefined}>
                    {x.title}
                  </MenuName>
                )}
              </MenuLink>
            </MenuItem>
          )
        })}
      </Menu>

      <Box mt={collapsed ? '0px' : '10px'} overflowY="hidden">
        {!collapsed && (
          <Box height={35} overflowY="hidden">
            <Text color="color22" fontSize={12}>
              PANGOLIN LINKS{' '}
            </Text>
          </Box>
        )}

        {pangolinLinks.map((x, index) => createMenuLink(x, index))}
      </Box>
      <Box mt={collapsed ? '0px' : '10px'}>
        {!collapsed && (
          <Box height={35} overflowY="hidden">
            <Text color="color22" fontSize={12}>
              {t('header.usefulLinks')}
            </Text>
          </Box>
        )}

        {otherLinks.map((x, index) => createMenuLink(x, index))}
      </Box>
    </MenuWrapper>
  )
}
