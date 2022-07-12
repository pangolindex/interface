import { AbstractConnector } from '@web3-react/abstract-connector'
import React from 'react'
import styled from 'styled-components'
import Option from './Option'
import { WalletInfo, useTranslation } from '@pangolindex/components'
import { darken } from 'polished'
import Loader from '../Loader'

const PendingSection = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  width: 100%;
  & > * {
    width: 100%;
  }
`

const StyledLoader = styled(Loader)`
  margin-right: 1rem;
`

const LoadingMessage = styled.div<{ error?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  justify-content: flex-start;
  border-radius: 12px;
  margin-bottom: 20px;
  color: ${({ theme, error }) => (error ? theme.red1 : 'inherit')};
  border: 1px solid ${({ theme, error }) => (error ? theme.red1 : theme.text4)};

  & > * {
    padding: 1rem;
  }
`

const ErrorGroup = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  justify-content: flex-start;
`

const ErrorButton = styled.div`
  border-radius: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg4};
  margin-left: 1rem;
  padding: 0.5rem;
  font-weight: 600;
  user-select: none;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => darken(0.1, theme.text4)};
  }
`

const LoadingWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  justify-content: center;
`

export default function PendingView({
  option,
  connector,
  error = false,
  setPendingError,
  tryActivation
}: {
  option?: WalletInfo
  connector?: AbstractConnector
  error?: boolean
  setPendingError: (error: boolean) => void
  tryActivation: (connector: AbstractConnector, option: WalletInfo) => void
}) {
  const { t } = useTranslation()
  return (
    <PendingSection>
      <LoadingMessage error={error}>
        <LoadingWrapper>
          {error ? (
            <ErrorGroup>
              <div>{t('walletModal.errorConnecting')}.</div>
              <ErrorButton
                onClick={() => {
                  setPendingError(false)
                  connector && option && tryActivation(connector, option)
                }}
              >
                {t('walletModal.tryAgain')}
              </ErrorButton>
            </ErrorGroup>
          ) : (
            <>
              <StyledLoader />
              {t('walletModal.initializing')}
            </>
          )}
        </LoadingWrapper>
      </LoadingMessage>
      {option && (
        <Option
          id={`connect-${option.name}`}
          key={option.name}
          clickable={false}
          color={option.color}
          header={option.name}
          subheader={option.description}
          icon={option.iconName}
        />
      )}
    </PendingSection>
  )
}
