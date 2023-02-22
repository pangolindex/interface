import React, { useRef } from 'react'
import { StyledMenu, MenuFlyout, StyledMenuButton } from '../StyledMenu'
import styled from 'styled-components'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/actions'
import { availableLanguages, i18n, useOnClickOutside } from '@pangolindex/components'

const NarrowMenuFlyout = styled(MenuFlyout)`
  min-width: 7.125rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    top: -14.25rem;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    top: 50px;
  `};
`

export const ClickableMenuItem = styled.a`
  flex: 1;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
  > svg {
    margin-right: 8px;
  }
`

const FlagIcon = styled.img`
  height: 15px;
  width: 21px;
  margin-top: 3px;
`

export default function LanguageSelection() {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.LANGUAGE)
  const toggle = useToggleModal(ApplicationModal.LANGUAGE)

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        <FlagIcon src={`./images/flags/${i18n.language}.svg`} />
      </StyledMenuButton>
      {open && (
        <NarrowMenuFlyout>
          {availableLanguages.map((lang, i) => (
            <ClickableMenuItem
              key={i}
              onClick={() => {
                i18n.changeLanguage(lang)
                toggle()
              }}
            >
              <FlagIcon src={`./images/flags/${lang}.svg`} /> &nbsp;
              {lang.toUpperCase()}
            </ClickableMenuItem>
          ))}
        </NarrowMenuFlyout>
      )}
    </StyledMenu>
  )
}
