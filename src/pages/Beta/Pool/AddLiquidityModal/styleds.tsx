import styled from 'styled-components'

export const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  width: 100%;
  align-items: center;
  max-width: 420px;
  min-width: 420px;
  padding: 10px;
  position: relative;
  overflow: hidden;
`

export const ConfirmButton = styled.button`
  width: 100%;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg6};
  margin-top: 10px;
  padding: 10px;
  border: none;
  color: ${({ theme }) => theme.text1};
  font-size: 16px;
  cursor: pointer;

  :hover, :focus {
    opacity: 0.8;
  }
`
