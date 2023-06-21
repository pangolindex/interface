import styled from 'styled-components'
import { Box } from '@pangolindex/components'

export const PageWrapper = styled(Box)`
  width: 100%;
`

export const Frame = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`

export const Wrapper = styled(Box)`
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 7px;
  padding: 1em;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
  width: 70%;
  padding: 30px;
  cursor: pointer;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width: 100%;
  `};
`

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
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
  border: 1px solid #353535;
`
