import React, { useContext, useState, useCallback, useEffect } from 'react'
import { ThemeContext } from 'styled-components'
import { MenuItem, MenuLink, MenuName } from './styled'
import { MENU_LINK } from 'src/constants'

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

interface NavItemProps {
  item: LinkProps
  collapsed?: boolean
  onClick?: () => void
}

const NavItem = ({ item, collapsed, onClick }: NavItemProps) => {
  const [expanded, setExpand] = useState(false)
  const theme = useContext(ThemeContext)

  const onExpandChange = useCallback(() => {
    setExpand(expanded => !expanded)
  }, [setExpand])

  useEffect(() => {
    setExpand(false)
  }, [collapsed])

  const renderMenuItem = (x: LinkProps, isChildren: boolean) => {
    const Icon = x.icon
    const isHaveChildren = x?.childrens && x?.childrens?.length > 0
    const menuItemInnerProps = isHaveChildren ? { onClick: onExpandChange } : { to: x.link, onClick }

    return (
      <MenuItem isActive={x.isActive} key={x.id} isChildren={isChildren}>
        <MenuLink id={x.id} isHaveChildren={isHaveChildren ? true : false} {...menuItemInnerProps}>
          <Icon size={16} fillColor={x.isActive ? theme.black : theme.color22} />
          {!collapsed && (
            <MenuName fontSize={[16, 14]} color={x.isActive ? 'black' : undefined}>
              {x.title}
            </MenuName>
          )}
        </MenuLink>
      </MenuItem>
    )
  }

  return (
    <>
      {renderMenuItem(item, false)}

      {expanded &&
        (item?.childrens || []).map((subItem: LinkProps) => {
          return renderMenuItem(subItem, true)
        })}
    </>
  )
}
export default NavItem
