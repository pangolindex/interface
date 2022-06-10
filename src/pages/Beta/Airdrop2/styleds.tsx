import styled from 'styled-components'
import { Box } from '@pangolindex/components'
import { X } from 'react-feather'

export const PageWrapper = styled(Box)`
  width: 100%;
`

export const MainTitle = styled.p`
  font-size: 44px;
  font-weight: 500;
  line-height: 66px;
  color: white;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 25px
  `}
`
export const BoxWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `};
`

export const ClaimBox = styled(Box)`
  min-width: 27%;
  max-width: 30%;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 7px;
  padding: 1em;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-width: 70%;
    min-height: 70%
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width: 100%;
    min-height: 70%
  `};
`

export const SmallSeparator = styled.div`
  padding: 20px;
`

export const SeparatorEmpty = styled(Box)`
  margin-bottom: 15px;
`

export const StyledLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

export const QuestionBox = styled(Box)`
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 10px;
  min-width: 50%;
  max-width: 50%;
  padding: 30px 30px 0 30px;
  cursor: pointer;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width: 100%;
  `};
`
export const StyledClose = styled(X)`
  :hover {
    cursor: pointer;
  }
`

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
`

export const CenterText = styled.div`
  text-align: center;
`

export const TextBottomWrapper = styled.div`
  text-align: center;
  padding-top: 10px;
`

export const StyledLogoMinus = styled.img<{ size: string; height: string }>`
  width: ${({ size }) => size};
  height: ${({ height }) => height};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

export const Separator = styled(Box)`
  margin-bottom: 35px;
  margin-top: 15px;
  border: 1px solid #353535;
`
