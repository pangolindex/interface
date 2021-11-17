import React from 'react'
import { Text, Box } from '@pangolindex/components'
import { useTranslation } from 'react-i18next'
import { Wrapper, IconWrapper, Icon, Link } from './styled'
import Telegram from '../../assets/svg/social/Telegram.svg'
import Twitter from '../../assets/svg/social/Twitter.svg'
import Youtube from '../../assets/svg/social/Youtube.svg'
import Medium from '../../assets/svg/social/Medium.svg'

interface SocialMediaProps {
  collapsed: boolean
}

export default function SocialMedia({ collapsed }: SocialMediaProps) {
  const { t } = useTranslation()

  const socialLinks = [
    {
      link: 'https://twitter.com/pangolindex',
      icon: Twitter,
      title: 'Twitter'
    },
    {
      link: 'https://t.me/pangolindex',
      icon: Telegram,
      title: 'Telegram'
    },
    {
      link: 'https://www.youtube.com/channel/UClJJTG4FRL4z3AOf-ZWXZLw',
      icon: Youtube,
      title: 'Youtube'
    },
    {
      link: 'https://pangolindex.medium.com/',
      icon: Medium,
      title: 'Medium'
    }
  ]

  return (
    <Wrapper>
      {!collapsed && (
        <Box textAlign="center">
          <Text fontSize={12} color="text4">
            {t('header.comeAndJoinUs')}
          </Text>
        </Box>
      )}

      <IconWrapper collapsed={collapsed}>
        {socialLinks.map((x, index) => {
          return (
            <Link key={index} href={x.link}>
              <Icon height={'16px'} src={x.icon} alt={x.title} />
            </Link>
          )
        })}
      </IconWrapper>

      {/* {!collapsed && (
        <Box display="inline-flex" justifyContent="space-between" alignItems="center">
          <img height={'28px'} src={AppStore} alt={'AppStore'} style={{ marginRight: '5px' }} />
          <img height={'28px'} src={PlayStore} alt={'PlayStore'} />
        </Box>
      )} */}
    </Wrapper>
  )
}
