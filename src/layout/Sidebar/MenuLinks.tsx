import React from 'react'
import { Menu, MenuItem, MenuName, MenuExternalLink, MenuWrapper } from './styled'
import { Box, Text, useTranslation } from '@pangolindex/components'
import { ChainId } from '@pangolindex/sdk'
import {
  Dashboard,
  Swap,
  Stake,
  Pool,
  Buy,
  Vote,
  Airdrop,
  Bridge as BridgeIcon,
  CoinbasePay,
  MoonPay,
  C14
} from 'src/components/Icons'
import Charts from 'src/assets/svg/menu/analytics.svg'
import { MENU_LINK, ANALYTICS_PAGE, BUY_MENU_LINK } from 'src/constants'
import Bridge from 'src/assets/svg/menu/bridge.svg'
import Governance from 'src/assets/svg/menu/governance.svg'
import { useLocation } from 'react-router-dom'
import { useChainId } from 'src/hooks'
import { shouldHideMenuItem } from 'src/utils'
import NavItem from './NavItem'

interface Props {
  collapsed?: boolean
  onClick?: () => void
}

export interface LinkProps {
  link: MENU_LINK | string
  icon:
    | string
    | React.FC<{
        size: number
        fillColor: string
      }>
  //icon: any
  title: string
  id: string
  isActive?: boolean
  childrens?: Array<LinkProps>
}

export const MenuLinks: React.FC<Props> = ({ collapsed = false, onClick }) => {
  const { t } = useTranslation()
  const chainId = useChainId()

  const location: any = useLocation()

  let mainLinks = [
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
      isActive: location?.pathname?.startsWith(MENU_LINK.buy),
      childrens: [
        {
          link: `${MENU_LINK.buy}/${BUY_MENU_LINK.coinbasePay}`,
          icon: CoinbasePay,
          title: `Coinbase Pay`,
          id: `${BUY_MENU_LINK.coinbasePay}`,
          isActive: location?.pathname?.startsWith(`${MENU_LINK.buy}/${BUY_MENU_LINK.coinbasePay}`)
        },
        {
          link: `${MENU_LINK.buy}/${BUY_MENU_LINK.moonpay}`,
          icon: MoonPay,
          title: 'Moonpay',
          id: `${BUY_MENU_LINK.moonpay}`,
          isActive: location?.pathname?.startsWith(`${MENU_LINK.buy}/${BUY_MENU_LINK.moonpay}`)
        }
      ]
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
      title: `${t('header.stake')}`,
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
    },
    {
      link: MENU_LINK.bridge,
      icon: BridgeIcon,
      title: `${t('header.bridge')}`,
      id: 'bridge',
      isActive: location?.pathname?.startsWith(MENU_LINK.bridge)
    }
  ]

  // dirty way to add c14 buy link for evmos mainnet
  if (chainId === ChainId.EVMOS_MAINNET && mainLinks?.[2]?.childrens) {
    mainLinks[2].childrens.push({
      link: `${MENU_LINK.buy}/${BUY_MENU_LINK.c14}`,
      icon: C14,
      title: 'C14',
      id: `${BUY_MENU_LINK.c14}`,
      isActive: location?.pathname?.startsWith(`${MENU_LINK.buy}/${BUY_MENU_LINK.c14}`)
    })
  }

  mainLinks = mainLinks.filter(link => !shouldHideMenuItem(chainId, link.link as MENU_LINK))

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
    },
    {
      link: 'https://www.hashport.network/',
      icon: Bridge,
      title: `Hashport ${t('header.bridge')}`,
      id: 'hashport-bridge'
    }
  ]

  const createMenuLink = (link: LinkProps, index: number) => {
    return (
      <MenuItem key={index}>
        <MenuExternalLink id={link.id} href={link.link}>
          <img src={link.icon as string} width={16} alt={link.title} />
          {!collapsed && <MenuName fontSize={[16, 14]}>{link.title}</MenuName>}
        </MenuExternalLink>
      </MenuItem>
    )
  }

  return (
    <MenuWrapper>
      <Menu>
        {mainLinks.map((x, index) => {
          return <NavItem key={index} item={x} onClick={onClick} collapsed={collapsed} />
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
