import styled from 'styled-components'
import { Box } from '@pangolindex/components'

export const PageWrapper = styled(Box)`
  width: 100%;
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
  background-color: #111;
  border-radius: 7px;
  padding: 1em;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  min-width: 70%;
  min-height: 70%
  `};
`

export const Separator = styled(Box)`
  border: 1px solid rgba(255, 255, 255, 0.22);
  margin-bottom: 15px;
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

export const QuestionWrapper = styled(Box)`
  display: flex;
  justify-content: space-around;
  gap: 15px;
  padding-bottom: 30px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
    align-items: center;
    justify-content: center;
    `};
`
export const QuestionBox = styled(Box)`
  background-color: #111111;
  border-radius: 10px;
  min-width: 70%;
  max-width: 70%;
  padding: 30px;
  cursor: pointer;
  
`