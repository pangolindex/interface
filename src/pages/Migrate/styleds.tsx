import { Box, Button } from '@pangolindex/components'
import styled from 'styled-components'
import { RowFixed } from '../../components/Row'
import { Settings, ChevronRight } from 'react-feather'

export const PageWrapper = styled(Box)`
  width: 100%;
`

export const FirstWrapper = styled(RowFixed)`
  gap: 40px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100%;
  justify-content: space-between;
 `};
`

export const ButtonRow = styled(RowFixed)`
  gap: 40px;
  width: 60%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100%;
  justify-content: space-between;
 `};
`

export const ResponsiveButtonPrimary = styled(Button)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

export const ResponsiveButtonOutline = styled(Button)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

export const MigrateStateCard = styled(Box)`
  background-color: #111111;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
`

export const StyledMenuIcon = styled(Settings)`
  height: 70px;
  width: 70px;

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

export const StatisticImage = styled.img`
  height: 80px;
  width: 80px;
`

export const PanelWrapper = styled.div`
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: max-content;
  gap: 15px;
  display: inline-grid;
  width: 100%;
  align-items: start;
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    > * {
      grid-column: 1 / 4;
    }

    > * {
      &:first-child {
        width: 100%;
      }
    }
  }
`

export const InfoWrapper = styled(Box)`
  background-color: ${({ theme }) => theme.bg2};
  margin-top: 40px;
  padding: 50px;
  width: 100%;
  text-align: center;
`

export const ProcessWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  max-width: 450px;
  margin: 0px auto;
  padding: 30px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column
  `};
`

export const CircleIcon = styled(Box)`
  background-color: ${({ theme }) => theme.bg6};
  height: 150px;
  width: 150px;
  border-radius: 50%;
  border: 1px solid #fff;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
`

export const ArrowRight = styled(ChevronRight)`
  color: ${({ theme }) => theme.text1};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    transform: rotate(90deg);
  `};
`

export const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
