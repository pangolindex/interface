import styled from 'styled-components'
import { Box } from 'rebass/styled-components'

const Card = styled(Box)<{ padding?: string; border?: string; borderRadius?: string }>`
  width: 100%;
  border-radius: 16px;
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`
export default Card

export const BlackCard = styled(Card)`
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text1};
`
