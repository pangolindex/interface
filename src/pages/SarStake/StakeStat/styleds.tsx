import styled from 'styled-components'
import { Box } from '@pangolindex/components'

export const Wrapper = styled(Box)`
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 30px;
  background-color: ${({ theme }) => theme.color2};
  border-radius: 10px;
  padding: 16px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 450px) {
    grid-template-columns: 1fr;
  }
`

export const Title = styled(Box)`
  display: inline-grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: center;
  justify-items: center;
  width: auto;
`

export const StatWrapper = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, max-content));
  gap: 20px;
  justify-content: end;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }
`
