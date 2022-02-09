import styled from 'styled-components'

export const ChartWrapper = styled.div`
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.color2};
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

export const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  bottom: 0px;
  left: 0px;
  position: absolute;
`
