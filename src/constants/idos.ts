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
    id: 5,
    title: 'Kalao',
    description: '',
    status: IDO_STATUS_UPCOMING,
    launchpad: 'Avalaunch',
    announcementUrl: 'https://medium.com/avalaunch/kalao-x-avalaunch-ido-announcement-c788122628ab',
    projectIconLocation: '/images/kalao-icon.svg',
    projectUrl: 'https://www.kalao.io/',
    startTime: '',
    endTime: ''
  },
  {
    id: 1,
    title: 'Boo Finance',
    description: '',
    status: IDO_STATUS_UPCOMING,
    launchpad: 'Penguin Finance',
    announcementUrl: 'https://twitter.com/penguin_defi/status/1431640280063750155?s=20',
    projectIconLocation: '/images/boofinance-icon.jpeg',
    projectUrl: 'https://www.boofinance.io/',
    startTime: '',
    endTime: ''
  },
  {
    id: 2,
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
    id: 3,
    title: 'Oh! Finance',
    description: '',
    status: IDO_STATUS_UPCOMING,
    launchpad: 'Avalaunch',
    announcementUrl: 'https://medium.com/avalaunch/coming-soon-to-avalaunch-398e8281f7fb',
    projectIconLocation: '/images/oh-finance-icon.png',
    projectUrl: 'https://oh.finance/',
    startTime: '',
    endTime: ''
  },
  {
    id: 4,
    title: 'Rise Online',
    description: '',
    status: IDO_STATUS_UPCOMING,
    launchpad: 'Avalaunch',
    announcementUrl: 'https://medium.com/avalaunch/coming-soon-to-avalaunch-398e8281f7fb',
    projectIconLocation: '/images/rise-online-icon.png',
    projectUrl: 'https://www.riseonlineworld.com/en',
    startTime: '',
    endTime: ''
  },
  {
    id: 6,
    title: 'Colony',
    description: '',
    status: IDO_STATUS_UPCOMING,
    launchpad: 'Avalaunch',
    announcementUrl: 'https://medium.com/avalaunch/coming-soon-to-avalaunch-398e8281f7fb',
    projectIconLocation: '/images/colony-icon.jpeg',
    projectUrl: 'https://colonylab.io/',
    startTime: '',
    endTime: ''
  }
]
