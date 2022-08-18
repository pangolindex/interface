import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { Menu, MenuItem, MenuLink, MenuName, MenuExternalLink, MenuWrapper } from './styled'
import { Box, Text, useTranslation } from '@pangolindex/components'
import { useChainId } from 'src/hooks'
import { CHAINS } from '@pangolindex/sdk'
import { MainLink, OtherLink } from '../types'

interface Props {
  collapsed?: boolean
  onClick?: () => void
  mainLinks: MainLink[]
  pangolinLinks?: OtherLink[]
  otherLinks?: OtherLink[]
}

export const MenuLinks: React.FC<Props> = ({
  collapsed = false,
  onClick,
  mainLinks,
  pangolinLinks = [],
  otherLinks = []
}) => {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()
  const chainId = useChainId()
  const chain = CHAINS[chainId]

  // for now, for non evm chain, hide all other menus except dashboard and swap
  if (!chain.evm) {
    mainLinks.splice(4)
  }

  const createMenuLink = (link: OtherLink, index: number) => {
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

      {pangolinLinks.length > 0 && (
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
      )}

      {otherLinks.length > 0 && (
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
      )}
    </MenuWrapper>
  )
}
