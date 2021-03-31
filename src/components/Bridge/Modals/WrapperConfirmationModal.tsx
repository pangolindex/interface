import React from 'react'
import {useActiveWeb3React} from '../../../hooks'
import {Break, CardBGImage, CardNoise, CardSection, DataCard} from '../../earn/styled'
import {RowBetween} from '../../Row'
import {ExternalLink, TYPE} from '../../../theme'
import {X} from 'react-feather'
import {AutoColumn} from '../../Column'
import styled from 'styled-components'
import {darken} from 'polished'
import {ButtonPrimary} from '../../Button'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ModalUpper = styled(DataCard)`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #f97316 0%, #E84142 100%);
  padding: 0.5rem;
`

const StyledClose = styled(X)`
  position: absolute;
  right: 16px;
  top: 16px;

  :hover {
    cursor: pointer;
  }
`
const StyledExternalLink = styled(ExternalLink)`
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({theme}) => theme.text2};
  font-size: 1rem;
  font-weight: 500;

  :hover,
  :focus {
    text-decoration: none;
    color: ${({theme}) => darken(0.1, theme.text1)};
  }

  ${({theme}) => theme.mediaWidth.upToExtraSmall`
      display: none;
`}
`


interface ConfirmationModalProps {
  open: boolean
  close: () => void
  sender: string
  value: number
  tokenSymbol: string
  sourceNetwork: string
  start: () => void
  wrappedTitle: string
  action: "wrap" | "unwrap" | "none"
}

export default function WrapperConfirmationModal({
                                                   open,
                                                   close,
                                                   sender,
                                                   sourceNetwork,
                                                   tokenSymbol,
                                                   value,
                                                   start,
                                                   wrappedTitle,
                                                   action,
                                                 }: ConfirmationModalProps) {
  const {account} = useActiveWeb3React()

  return (
    <ContentWrapper gap="lg">
      <ModalUpper>
        <CardBGImage/>
        <CardNoise/>
        <CardSection gap="md">
          <RowBetween>
            <TYPE.white color="white">Wrapping Summary</TYPE.white>
            <StyledClose stroke="white" onClick={close}/>
          </RowBetween>
        </CardSection>
        <Break/>
        {account && (
          <>
            <CardSection gap="sm">
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white color="white">Disclaimer:

                    This is an interface for the <StyledExternalLink href={'http://www.aeb.xyz'}>Chainsafe
                      Avalanche-Ethereum bridge</StyledExternalLink>. Both this interface and the underlying bridge are
                    experimental applications.

                    <p>Funds can be lost as a result of a bug.</p>
                    <p>Submitted transactions can not be reverted.</p>
                    <p>Transactions can get stuck.</p>
                    <p>Use at your own risk.</p></TYPE.white>

                </RowBetween>
              </AutoColumn>
            </CardSection>
            <Break/>
          </>
        )}
        <CardSection gap="sm">
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.white color="white">This operation will convert {value} {tokenSymbol}
                &nbspon&nbsp <strong>{sourceNetwork}</strong> to&nbsp<strong>{wrappedTitle}</strong></TYPE.white>
              <TYPE.white color="white"></TYPE.white>
            </RowBetween>
          </AutoColumn>
        </CardSection>
        <CardSection gap="sm">
          <AutoColumn gap="md">
            <RowBetween>
              <ButtonPrimary disabled={action === "none"} onClick={start}
                             style={{width: '45%'}}>{action === "wrap" ? "Wrap" : "Unwrap"}</ButtonPrimary>
              <ButtonPrimary onClick={close} style={{width: '45%'}}>Cancel</ButtonPrimary>
            </RowBetween>
          </AutoColumn>
        </CardSection>
      </ModalUpper>
    </ContentWrapper>
  )
}
