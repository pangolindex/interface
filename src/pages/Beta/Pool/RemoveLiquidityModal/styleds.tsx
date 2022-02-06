import styled from 'styled-components'

export const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  align-items: center;
  width: 420px;
  padding: 10px;
  position: relative;
  overflow: hidden;
`
