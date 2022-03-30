import React, { useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'

import { RouteComponentProps } from 'react-router-dom'
import { useCurrency } from '../../hooks/Tokens'
import { ExternalLink, TYPE } from '../../theme'

import { RowBetween } from '../../components/Row'
import { CardSection, DataCard } from '../../components/earn/styled'
import { ButtonPrimary } from '../../components/Button'
import { useStakingInfo } from '../../state/stake/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'

import { PairState, usePair } from '../../data/Reserves'
import StakingModal from '../../components/earn/StakingModal'
import UnstakingModal from '../../components/earn/UnstakingModal'
import Confetti from '../../components/Confetti'
import BridgeMigratorModal from '../../components/earn/BridgeMigratorModal'
import Loader from '../../components/Loader'
import { Token, WAVAX } from '@antiyro/sdk'
import { getTokenLogoURL } from '../../constants'
import { PNG } from '../../constants/tokens'
import { ErrorText } from '../../components/swap/styleds'
import { injected } from '../../connectors'
import { useChainId } from 'src/hooks'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const StepCard = styled(DataCard)`
  background: #22242a;
  overflow: hidden;
`

const SuccessCard = styled(DataCard)`
  background: green;
  overflow: hidden;
`

const ErrorCard = styled(DataCard)`
  background: darkred;
  overflow: hidden;
`

export default function Migrate({
  match: {
    params: { currencyIdFromA, currencyIdFromB, versionFrom, currencyIdToA, currencyIdToB, versionTo }
  }
}: RouteComponentProps<{
  currencyIdFromA: string
  currencyIdFromB: string
  versionFrom: string
  currencyIdToA: string
  currencyIdToB: string
  versionTo: string
}>) {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()

  const currencyFromA = useCurrency(currencyIdFromA)
  const currencyFromB = useCurrency(currencyIdFromB)
  const currencyToA = useCurrency(currencyIdToA)
  const currencyToB = useCurrency(currencyIdToB)

  const [pglFromStatus, pglFrom] = usePair(currencyFromA ?? undefined, currencyFromB ?? undefined)
  const [pglToStatus, pglTo] = usePair(currencyToA ?? undefined, currencyToB ?? undefined)

  const canZap =
    (pglFrom?.involvesToken(PNG[chainId]) && pglTo?.involvesToken(PNG[chainId])) ||
    (pglFrom?.involvesToken(WAVAX[chainId]) && pglTo?.involvesToken(WAVAX[chainId]))

  const stakingInfoFrom = useStakingInfo(Number(versionFrom), pglFrom)?.[0]
  const stakingInfoTo = useStakingInfo(Number(versionTo), pglTo)?.[0]

  const pglFromBalance = useTokenBalance(account ?? undefined, pglFrom?.liquidityToken)
  const pglToBalance = useTokenBalance(account ?? undefined, pglTo?.liquidityToken)

  const arePairsDifferent = pglFrom?.liquidityToken?.address !== pglTo?.liquidityToken?.address

  // Step 1: Detect if old LP tokens are staked
  const requiresUnstake = stakingInfoFrom?.stakedAmount?.greaterThan('0')

  // Step 2: Detect if old LP is currently held and cannot be migrated directly to the new staking contract
  const requiresConvert = !requiresUnstake && arePairsDifferent && pglFromBalance?.greaterThan('0')

  // Step 3: Detect if new LP has been minted and not staked
  const requiresStake = !requiresUnstake && !requiresConvert && !!stakingInfoTo && pglToBalance?.greaterThan('0')

  // Detect if all steps have been completed
  const requiresNothing = !!pglFromBalance && !!pglToBalance && !requiresUnstake && !requiresConvert && !requiresStake

  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showMigrateModal, setShowMigrateModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)

  const addTokenButton = (token: Token | undefined) => {
    if (!token) return
    if (token.equals(PNG[chainId])) return
    if (token.equals(WAVAX[chainId])) return
    return (
      <ButtonPrimary
        width={'250'}
        onClick={() => {
          injected.getProvider().then(provider => {
            provider
              .request({
                method: 'wallet_watchAsset',
                params: {
                  type: 'ERC20',
                  options: {
                    address: token.address,
                    symbol: token.symbol,
                    decimals: token.decimals,
                    image: getTokenLogoURL(token.address, 48)
                  }
                }
              })
              .catch((error: any) => {
                console.error(error)
              })
          })
        }}
      >
        Add {token.symbol}
      </ButtonPrimary>
    )
  }

  return (
    <PageWrapper gap="lg" justify="center">
      <RowBetween style={{ gap: '24px' }}>
        <TYPE.mediumHeader style={{ margin: 0 }}>Liquidity Migration</TYPE.mediumHeader>
      </RowBetween>

      {pglFromStatus === PairState.LOADING || pglToStatus === PairState.LOADING ? (
        <Loader />
      ) : pglFromStatus === PairState.EXISTS && pglToStatus === PairState.EXISTS ? (
        <>
          <StepCard>
            <CardSection>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white fontWeight={600}>Step 1. Unstake Pangolin liquidity (PGL)</TYPE.white>
                </RowBetween>
                {requiresUnstake && (
                  <>
                    <RowBetween style={{ marginBottom: '1rem' }}>
                      <TYPE.white fontSize={14}>
                        {`You are currently staking deprecated PGL tokens. Unstake to continue the migration process`}
                      </TYPE.white>
                    </RowBetween>
                    <ButtonPrimary
                      padding="8px"
                      borderRadius="8px"
                      width={'fit-content'}
                      onClick={() => setShowUnstakingModal(true)}
                    >
                      {`Unstake ${stakingInfoFrom?.stakedAmount?.toSignificant(4) ?? ''} ${pglFrom?.token0?.symbol}-${
                        pglFrom?.token1?.symbol
                      } liquidity`}
                    </ButtonPrimary>
                  </>
                )}
              </AutoColumn>
            </CardSection>
          </StepCard>

          <StepCard>
            <CardSection>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white fontWeight={600}>Step 2. Convert Pangolin liquidity tokens (PGL)</TYPE.white>
                </RowBetween>
                {requiresConvert && (
                  <>
                    <RowBetween style={{ marginBottom: '1rem' }}>
                      <TYPE.white fontSize={14}>
                        {`You are currently holding deprecated PGL tokens. Migrate them including the underlying assets they represent to continue the migration process`}
                      </TYPE.white>
                    </RowBetween>
                    {canZap ? (
                      <ButtonPrimary
                        padding="8px"
                        borderRadius="8px"
                        width={'fit-content'}
                        onClick={() => setShowMigrateModal(true)}
                      >
                        {`Migrate ${pglFromBalance?.toSignificant(4) ?? ''} ${pglFrom?.token0?.symbol}-${
                          pglFrom?.token1?.symbol
                        } to ${pglTo?.token0?.symbol}-${pglTo?.token1?.symbol}`}
                      </ButtonPrimary>
                    ) : (
                      <ErrorText severity={2}>
                        {`Pangolin does not support auto migration of this pair. Please withdraw the PGL and upgrade the tokens at `}
                        <ExternalLink href={'https://bridge.avax.network/convert'}>
                          https://bridge.avax.network/convert
                        </ExternalLink>
                      </ErrorText>
                    )}
                  </>
                )}
              </AutoColumn>
            </CardSection>
          </StepCard>

          <StepCard>
            <CardSection>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white fontWeight={600}>Step 3. Stake Pangolin liquidity (PGL)</TYPE.white>
                </RowBetween>
                {requiresStake && (
                  <>
                    <ButtonPrimary
                      padding="8px"
                      borderRadius="8px"
                      width={'fit-content'}
                      onClick={() => setShowStakingModal(true)}
                    >
                      {`Stake ${pglToBalance?.toSignificant(4) ?? ''} ${pglTo?.token0?.symbol}-${
                        pglTo?.token1?.symbol
                      } liquidity to earn PNG`}
                    </ButtonPrimary>
                  </>
                )}
              </AutoColumn>
            </CardSection>
          </StepCard>

          {requiresNothing && (
            <>
              <SuccessCard>
                <CardSection>
                  <AutoColumn gap="md">
                    <RowBetween>
                      <TYPE.white fontWeight={600} textAlign={'center'}>
                        {'Congratulations you have successfully migrated!'}
                      </TYPE.white>
                    </RowBetween>
                  </AutoColumn>
                </CardSection>
              </SuccessCard>
              {addTokenButton(pglTo?.token0)}
              {addTokenButton(pglTo?.token1)}
            </>
          )}
        </>
      ) : (
        <ErrorCard>
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600} textAlign={'center'}>
                  {`Error finding pairs ${currencyFromA?.symbol ?? '?'}/${currencyFromB?.symbol ??
                    '?'} and ${currencyToA?.symbol ?? '?'}/${currencyToB?.symbol ?? '?'}`}
                </TYPE.white>
              </RowBetween>
            </AutoColumn>
          </CardSection>
        </ErrorCard>
      )}

      <Confetti start={requiresNothing && !showMigrateModal && !showStakingModal} />

      {stakingInfoFrom && (
        <UnstakingModal
          isOpen={showUnstakingModal}
          onDismiss={() => setShowUnstakingModal(false)}
          stakingInfo={stakingInfoFrom}
          version={Number(versionFrom)}
        />
      )}

      {pglFrom && pglTo && (
        <BridgeMigratorModal
          isOpen={showMigrateModal}
          onDismiss={() => setShowMigrateModal(false)}
          pairFrom={pglFrom}
          pairTo={pglTo}
          userLiquidityUnstaked={pglFromBalance}
        />
      )}

      {stakingInfoTo && (
        <StakingModal
          isOpen={showStakingModal}
          onDismiss={() => setShowStakingModal(false)}
          stakingInfo={stakingInfoTo}
          userLiquidityUnstaked={pglToBalance}
          version={Number(versionTo)}
        />
      )}
    </PageWrapper>
  )
}
