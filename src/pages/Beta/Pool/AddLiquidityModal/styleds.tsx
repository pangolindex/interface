import styled from 'styled-components'

export const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  width: 100%;
  align-items: center;
  max-width: 420px;
  padding: 10px;
`
