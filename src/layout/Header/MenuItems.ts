import { Airdrop, Bridge, Buy, Dashboard, Pool, Stake, Swap, Vote } from 'src/components/Icons'
import { ANALYTICS_PAGE, MENU_LINK } from 'src/constants'
import ChartsIcon from 'src/assets/svg/menu/analytics.svg'
import BridgeIcon from 'src/assets/svg/menu/bridge.svg'
import GovernanceIcon from 'src/assets/svg/menu/governance.svg'

export const internalLinks = {
  Dashboard: {
    link: MENU_LINK.dashboard,
    icon: Dashboard,
    id: 'dashboard'
  },
  Swap: {
    link: MENU_LINK.swap,
    icon: Swap,
    id: 'swap'
  },
  Buy: {
    link: MENU_LINK.buy,
    icon: Buy,
    id: 'buy'
  },
  Pool: {
    link: MENU_LINK.pool,
    icon: Pool,
    id: 'pool'
  },
  Stake: {
    link: `${MENU_LINK.stake}/0`,
    icon: Stake,
    id: 'stake'
  },
  StakeV2: {
    link: MENU_LINK.stakev2,
    icon: Stake,
    id: 'stakev2'
  },
  Airdrop: {
    link: MENU_LINK.airdrop,
    icon: Airdrop,
    id: 'airdrop'
  },
  Bridge: {
    link: MENU_LINK.bridge,
    icon: Bridge,
    id: 'bridge'
  },
  Vote: {
    link: MENU_LINK.vote,
    icon: Vote,
    id: 'vote'
  }
}

export const externalLinks = {
  Charts: {
    link: ANALYTICS_PAGE,
    icon: ChartsIcon,
    id: 'charts'
  },
  Forum: {
    link: 'https://gov.pangolin.exchange',
    icon: GovernanceIcon,
    id: 'forum'
  },
  Team: {
    link: 'https://docs.pangolin.exchange/pangolin/team',
    icon: GovernanceIcon,
    id: 'team'
  },
  Docs: {
    link: 'https://docs.pangolin.exchange',
    icon: GovernanceIcon,
    id: 'docs'
  },
  Audits: {
    link: 'https://docs.pangolin.exchange/security-and-contracts/audits',
    icon: GovernanceIcon,
    id: 'audits'
  },
  AvalancheBridge: {
    link: 'https://bridge.avax.network/',
    icon: BridgeIcon,
    id: 'bridge'
  },
  SatelliteBridge: {
    link: 'https://satellite.axelar.network/',
    icon: BridgeIcon,
    id: 'satellite-bridge'
  }
}
