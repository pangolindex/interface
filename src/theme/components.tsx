import React, { HTMLProps } from 'react'
import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { X } from 'react-feather'
import { Box } from '@pangolindex/components'

export const CloseIcon = styled(X)<{ onClick: () => void }>`
  cursor: pointer;
`

// A button that triggers some onClick result, but looks like a link.
export const LinkStyledButton = styled.button<{ disabled?: boolean }>`
  border: none;
  text-decoration: none;
  background: none;

  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  color: ${({ theme, disabled }) => (disabled ? theme.text2 : theme.primary)};
  font-weight: 500;

  :hover {
    text-decoration: ${({ disabled }) => (disabled ? null : 'underline')};
  }

  :focus {
    outline: none;
    text-decoration: ${({ disabled }) => (disabled ? null : 'underline')};
  }

  :active {
    text-decoration: none;
  }
`

// An internal link from the react-router-dom library that is correctly styled
export const StyledInternalLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;

  :hover {
    text-decoration: underline;
  }

  :focus {
    outline: none;
    text-decoration: underline;
  }

  :active {
    text-decoration: none;
  }
`

const StyledLink = styled.a`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primary};
  font-weight: 500;

  :hover {
    text-decoration: underline;
  }

  :focus {
    outline: none;
    text-decoration: underline;
  }

  :active {
    text-decoration: none;
  }
`

const rotateImg = keyframes`
  0% {
    transform: perspective(1000px) rotateY(0deg);
  }

  100% {
    transform: perspective(1000px) rotateY(360deg);
  }
`

export const PngTokenAnimated = styled.img`
  animation: ${rotateImg} 5s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  padding: 2rem 0 0 0;
  filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.15));
`

/**
 * Outbound link that handles firing google analytics events
 */
export function ExternalLink({
  target = '_blank',
  href,
  rel = 'noopener noreferrer',
  ...rest
}: Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> & { href: string }) {
  return <StyledLink target={target} rel={rel} href={href} {...rest} />
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled.img`
  animation: 2s ${rotate} linear infinite;
  width: 16px;
  height: 16px;
`

export const CustomLightSpinner = styled(Spinner)<{ size: string }>`
  height: ${({ size }) => size};
  width: ${({ size }) => size};
`

export const Hidden = styled(Box)<{
  upToExtraSmall?: boolean
  upToSmall?: boolean
  upToMedium?: boolean
  upToLarge?: boolean
}>`
  ${({ theme, upToExtraSmall }) =>
    upToExtraSmall &&
    theme.mediaWidth.upToExtraSmall`
    display: none;
  `};

  ${({ theme, upToSmall }) =>
    upToSmall &&
    theme.mediaWidth.upToSmall`
    display: none;
  `};

  ${({ theme, upToMedium }) =>
    upToMedium &&
    theme.mediaWidth.upToMedium`
    display: none;
  `};

  ${({ theme, upToLarge }) =>
    upToLarge &&
    theme.mediaWidth.upToLarge`
    display: none;
  `};
`

export const Visible = styled(Box)<{
  upToExtraSmall?: boolean
  upToSmall?: boolean
  upToMedium?: boolean
  upToLarge?: boolean
}>`
  display: none;
  ${({ theme, upToExtraSmall }) =>
    upToExtraSmall &&
    theme.mediaWidth.upToExtraSmall`
    display: block;
  `};

  ${({ theme, upToSmall }) =>
    upToSmall &&
    theme.mediaWidth.upToSmall`
    display: block;
  `};

  ${({ theme, upToMedium }) =>
    upToMedium &&
    theme.mediaWidth.upToMedium`
    display: block;
  `};

  ${({ theme, upToLarge }) =>
    upToLarge &&
    theme.mediaWidth.upToLarge`
    display: block;
  `};
`
