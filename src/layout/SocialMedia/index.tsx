import React from 'react'
import { Text, Box, useTranslation } from '@pangolindex/components'
import { Wrapper, IconWrapper, Icon, Link } from './styled'
import Telegram from '../../assets/svg/social/telegram.svg'
import Twitter from '../../assets/svg/social/twitter.svg'
import Youtube from '../../assets/svg/social/youtube.svg'
import Medium from '../../assets/svg/social/medium.svg'
import Github from '../../assets/svg/social/github.svg'
import Discord from '../../assets/svg/social/discord.svg'
import Substack from '../../assets/svg/social/substack.svg'

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
      link: 'https://t.me/pangolindexV2',
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
    },
    {
      link: 'https://github.com/pangolindex',
      icon: Github,
      title: 'Github'
    },
    {
      link: 'https://discord.gg/pangolindex',
      icon: Discord,
      title: 'Discord'
    },
    {
      link: 'https://pangolin.substack.com/',
      icon: Substack,
      title: 'Substack'
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
    </Wrapper>
  )
}
