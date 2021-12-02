export const IDO_STATUS_UPCOMING = 'Upcoming'
export const IDO_STATUS_ENDED = 'Ended'

interface AnnouncedIDOItem {
  id: number
  title: string
  description?: string
  status: string
  launchpad: string
  announcementUrl: string
  projectIconLocation: string
  projectUrl: string
  startTime?: string
  endTime?: string
}

export const IDO_LIST: Array<AnnouncedIDOItem> = [
  {
    id: 1,
    title: 'Sherpa Cash',
    description: '',
    status: IDO_STATUS_ENDED,
    launchpad: 'Penguin Finance',
    announcementUrl:
      'https://penguin-finance.medium.com/penguin-launchpad-staking-for-the-upcoming-sherpa-distribution-is-now-live-239267f2b9db',
    projectIconLocation: '/images/sherpacash-icon.png',
    projectUrl: 'https://sherpa.cash/',
    startTime: '',
    endTime: ''
  },
  {
    id: 2,
    title: 'Boo Finance',
    description: '',
    status: IDO_STATUS_ENDED,
    launchpad: 'Penguin Finance',
    announcementUrl:
      'https://penguin-finance.medium.com/penguin-launchpad-allocation-staking-for-boofi-is-live-728f17ceea6c',
    projectIconLocation: '/images/boofinance-icon.jpeg',
    projectUrl: 'https://www.boofinance.io/',
    startTime: '',
    endTime: ''
  },
  {
    id: 3,
    title: 'Yay Protocol',
    description: '',
    status: IDO_STATUS_ENDED,
    launchpad: 'Avalaunch',
    announcementUrl:
      'https://medium.com/avalaunch/yay-games-update-public-sale-has-been-increased-to-400-000-63695d5788d5',
    projectIconLocation: '/images/yaygames-icon.png',
    projectUrl: 'https://www.yay.games/',
    startTime: '',
    endTime: ''
  },
  {
    id: 4,
    title: 'Kalao',
    description: '',
    status: IDO_STATUS_ENDED,
    launchpad: 'Avalaunch',
    announcementUrl: 'https://medium.com/avalaunch/kalao-x-avalaunch-ido-announcement-c788122628ab',
    projectIconLocation: '/images/kalao-icon.svg',
    projectUrl: 'https://www.kalao.io/',
    startTime: '',
    endTime: ''
  },
  {
    id: 5,
    title: 'HurricaneSwap',
    description: '',
    status: IDO_STATUS_ENDED,
    launchpad: 'Avalaunch',
    announcementUrl: 'https://launchpad.avalaunch.app/project-details?id=6',
    projectIconLocation: '/images/hurricaneswap-icon.png',
    projectUrl: 'https://hurricaneswap.com/',
    startTime: '',
    endTime: ''
  },
  {
    id: 6,
    title: 'RocoFinance',
    description: '',
    status: IDO_STATUS_ENDED,
    launchpad: 'Avalaunch',
    announcementUrl: 'https://launchpad.avalaunch.app/project-details?id=7',
    projectIconLocation: '/images/roco-icon.png',
    projectUrl: 'https://roco.finance/',
    startTime: '',
    endTime: ''
  },
  {
    id: 7,
    title: 'Oh! Finance',
    description: '',
    status: IDO_STATUS_ENDED,
    launchpad: 'Avalaunch',
    announcementUrl: 'https://launchpad.avalaunch.app/project-details?id=9',
    projectIconLocation: '/images/oh-finance-icon.png',
    projectUrl: 'https://oh.finance/',
    startTime: '',
    endTime: ''
  },
  {
    id: 8,
    title: 'Crabada',
    description: '',
    status: IDO_STATUS_ENDED,
    launchpad: 'Avalaunch',
    announcementUrl: 'https://launchpad.avalaunch.app/project-details?id=10',
    projectIconLocation: '/images/crabada-icon.png',
    projectUrl: 'https://www.crabada.com',
    startTime: '',
    endTime: ''
  },
  {
    id: 9,
    title: 'TaleCraft',
    description: '',
    status: IDO_STATUS_ENDED,
    launchpad: 'Avalaunch',
    announcementUrl: 'https://launchpad.avalaunch.app/project-details?id=11',
    projectIconLocation: '/images/talecraft-icon.png',
    projectUrl: 'https://talecraft.io',
    startTime: '',
    endTime: ''
  },
  {
    id: 10,
    title: 'Colony',
    description: '',
    status: IDO_STATUS_UPCOMING,
    launchpad: 'Avalaunch',
    announcementUrl: 'https://launchpad.avalaunch.app/project-details?id=12',
    projectIconLocation: '/images/colony-icon.jpeg',
    projectUrl: 'https://colonylab.io/',
    startTime: '',
    endTime: ''
  }
]
