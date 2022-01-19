import styled from 'styled-components'
import { AutoColumn } from 'src/components/Column'
import { DataCard } from 'src/components/earn/styled'
import { RowBetween } from 'src/components/Row'
import { StyledInternalLink } from 'src/theme'

export const PageWrapper = styled(AutoColumn)`
  width: 100%;
`

export const ProposalInfo = styled(AutoColumn)`
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  max-width: 960px;
  width: 100%;
`

export const ArrowWrapper = styled(StyledInternalLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
  color: ${({ theme }) => theme.text1};
  a {
    color: ${({ theme }) => theme.text1};
    text-decoration: none;
  }
  :hover {
    text-decoration: none;
  }
`

export const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
`

export const StyledDataCard = styled(DataCard)`
  width: 100%;
  background: none;
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text1};
  height: fit-content;
  z-index: 2;
`

export const ProgressWrapper = styled.div`
  width: 100%;
  margin-top: 1rem;
  height: 4px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.bg3};
  position: relative;
`

export const Progress = styled.div<{ status: 'for' | 'against'; percentageString?: string }>`
  height: 4px;
  border-radius: 4px;
  background-color: ${({ theme, status }) => (status === 'for' ? theme.green2 : theme.red3)};
  width: ${({ percentageString }) => percentageString};
`

export const MarkDownWrapper = styled.div`
  max-width: 640px;
  overflow: hidden;
`

export const WrapSmall = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    align-items: flex-start;
    flex-direction: column;
  `};
`

export const DetailText = styled.div`
  word-break: break-all;
`
