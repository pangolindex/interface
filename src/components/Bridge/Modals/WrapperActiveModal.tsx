import React from 'react'
import {useActiveWeb3React} from '../../../hooks'
import {Break, CardBGImage, CardNoise, CardSection, DataCard} from '../../earn/styled'
import {RowBetween} from '../../Row'
import {CustomLightSpinner, TYPE} from '../../../theme'
import {X} from 'react-feather'
import {AlertTriangle, CheckCircle} from 'react-feather'
import {AutoColumn, ColumnCenter} from '../../Column'
import styled from 'styled-components'
import {ButtonPrimary} from '../../Button'
import {useChainbridge} from '../../../contexts/chainbridge/ChainbridgeContext'
import Circle from '../../../assets/images/blue-loader.svg'
import {TokenConfig} from '../../../contexts/chainbridge/chainbridgeConfig'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
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

interface WrapperActiveModalProps {
  transactionStatus?: 'inProgress' | 'done' | 'error'
  value: number
  tokenInfo: TokenConfig
  txHash?: string
  close: () => void
  action: 'wrap' | 'unwrap' | 'none'
}

export default function WrapperActiveModal({
                                             transactionStatus,
                                             value,
                                             tokenInfo,
                                             txHash,
                                             close,
                                             action,
                                           }: WrapperActiveModalProps) {
  const {account} = useActiveWeb3React()
  const {homeChain} = useChainbridge()

  return (
    <ContentWrapper gap='lg'>
      <ModalUpper>
        <CardBGImage/>
        <CardNoise/>
        <CardSection gap='md'>
          <RowBetween>
            <TYPE.white color='white'>Transfer status</TYPE.white>
            <StyledClose stroke='white' onClick={close}/>
          </RowBetween>
        </CardSection>
        <Break/>
        {account && (
          <>
            <CardSection gap='sm'>
              <AutoColumn gap='md'>
                <RowBetween>
                  <ConfirmedIcon>
                    {transactionStatus === 'inProgress' ? (
                      <CustomLightSpinner src={Circle} alt='loader' size={'90px'}/>
                    ) : transactionStatus === 'done' ? (
                      <CheckCircle size={'90px'}/>
                    ) : (
                      <AlertTriangle size={'90px'}/>
                    )}

                  </ConfirmedIcon>

                  <TYPE.white color='white' width={'80%'}>
                    <h3>
                      {transactionStatus === 'inProgress' ? (
                        'Step 1/2'
                      ) : transactionStatus === 'done' ? (
                        'Step 2/2'
                      ) : (
                        'Error'
                      )}</h3>
                    <p>
                      {transactionStatus === 'error' ?
                        action === 'wrap'
                          ? 'Wrapping failed'
                          : 'Unwrapping failed'
                        : transactionStatus === 'inProgress'
                          ? action === 'wrap'
                            ? `Wrapping ${value} ${homeChain?.nativeTokenSymbol}`
                            : `Unwrapping ${value} ${tokenInfo.symbol}`
                          : action === 'wrap'
                            ? 'Token wrapped'
                            : 'Token unwrapped'} </p>
                  </TYPE.white>

                </RowBetween>
              </AutoColumn>
            </CardSection>
            <Break/>
          </>
        )}
        <CardSection gap='sm'>
          <AutoColumn gap='md'>
            <RowBetween>
              <ButtonPrimary onClick={close}>Close</ButtonPrimary>
            </RowBetween>
          </AutoColumn>
        </CardSection>
      </ModalUpper>
    </ContentWrapper>
  )
}
