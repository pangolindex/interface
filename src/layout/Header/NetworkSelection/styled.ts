import styled from 'styled-components'
import { Box } from '@pangolindex/components'
import { CloseIcon } from 'src/theme'

export const Frame = styled(Box)`
  width: 40vw;
  background-color: ${({ theme }) => theme.bg2};
  padding: 30px;
  display: grid;
  position: relative;
  grid-template-areas:"text buttons"
                      "chains chains";
  grid-template-columns: grid-template-columns: repeat(2, 50%);

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 60vw;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100vw;
  `};

`

export const ButtonFrame = styled(Box)`
  grid-area: buttons;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
`

export const CloseButton = styled(CloseIcon)`
  color: ${({ theme }) => theme.text1};
  position: absolute;
  right: 3px;
  top: 3px;
`

export const ChainsList = styled(Box)`
    display: grid;
    grid-template-columns: repeat(2, auto);
    gap: 20px;
`

export const ChainButton = styled.button`
  background-color: ${({theme}) => theme.bg8};
  display: flex;
  align-items: center;
  border: 0px;
  border-radius: 5px;
  cursor: pointer;
  padding: 10px;
  height: 48px;
  font-weight: 500;

  :hover{
    opacity: 0.5;
  }
`

export const Logo = styled.img`
  border-radius: 20px;
  height: 28px;
  width: 28px;
  margin-right: 10px;
`
