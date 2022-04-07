import styled from 'styled-components'
import { Box } from '@pangolindex/components'

export const PageWrapper = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: start;
  gap: 20px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  `};
`

export const Ibridge = styled(Box)`
  background-color: #111111;
  min-width: 30%;
  border-radius: 16px;
  max-height: 80%;
  font-family: 'Poppins';
  ${({ theme }) => theme.mediaWidth.upToMedium`
  min-height: 65vh;
  min-width: 90%;
  max-width: 90%;
  order: -2;
  `};
`

export const Separator = styled(Box)`
  margin-top: 25px;
`
export const SeparatorBorder = styled(Box)`
  margin-top: 15px;
  margin-bottom: 35px;
  border: 1px solid #353535;
`

export const ChainSelect = styled(Box)`
  align-items: center;
  height: 3rem;
  font-size: 20px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;
  background-color: #1c1c1c;
  margin-top: 5px;
  border-radius: 8px;
`

export const MaxButton = styled.div<{ width: string }>`
  padding: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  color: #8c8d93;
`
export const WrapButton = styled(Box)`
  display: flex;
`
export const StyledLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

export const FullBox = styled(Box)`
  display: flex;
  min-width: 70%;
  max-width: 70%;
  min-height: 90vh;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  min-width: 90%;
  max-width: 90%;
  flex-flow: column wrap;
  justify-content: center;
  order: -1;
  `};
`

export const QuestionBox = styled(Box)`
  background-color: #111111;
  padding: 30px;
  cursor: pointer;
  width: 70%;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  min-width: 100%;
  border-top-right-radius: 0px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  `};
`

export const TableContent = styled(Box)`
  background-color: #212427;
  padding: 20px;
  width: 30%
  cursor: pointer;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  min-width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 0px;

  `};
`

export const StepDisplay = styled.div`
  text-align: center;
  background-color: #212427;
  border-radius: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 20px;
`

export const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 20px;
  color: ${({ theme }) => theme.text1};
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.bg3};
  -webkit-appearance: none;

  font-size: 18px;

  ::placeholder {
    color: ${({ theme }) => theme.text3};
  }
  transition: border 100ms;
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
`
  
export const TokenOverviewContainer = styled.div`
  display: 'flex';
  width: '100%';
  alignItems: 'center';
  flexBasis: '25%';
  flexWrap: 'wrap';
  & div  {
    margin: theme.spacing(1),
    flexBasis: '25%',
    '&$tokenImageContainer': {
      maxWidth: 40
    }
    '&$tokenMarketsList {
      marginTop: theme.spacing(-0.5),
      marginLeft: 0,
      flexBasis: '100%'
    }
    &:last-child {
      textAlign: 'right'
    }
    flexShrink: 1
  }
  flexWrap: 'wrap'
  }
`