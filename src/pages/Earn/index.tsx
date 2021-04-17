import React from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'
import { TYPE, ExternalLink } from '../../theme'
import PoolCard from '../../components/earn/PoolCard'
import { RouteComponentProps } from 'react-router-dom'
import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import Loader from '../../components/Loader'
import { useActiveWeb3React } from '../../hooks'
import { JSBI } from '@pangolindex/sdk'


const PageWrapper = styled(AutoColumn)`
   max-width: 640px;
   width: 100%;
 `

const TopSection = styled(AutoColumn)`
   max-width: 720px;
   width: 100%;
 `

const PoolSection = styled.div`
   display: grid;
   grid-template-columns: 1fr;
   column-gap: 10px;
   row-gap: 15px;
   width: 100%;
   justify-self: center;
 `

export default function Earn({
	match: {
		params: { version }
	}
}: RouteComponentProps<{  version: string }>) {
	const { chainId } = useActiveWeb3React()
	const stakingInfos = useStakingInfo(Number(version))

	const DataRow = styled(RowBetween)`
     ${({ theme }) => theme.mediaWidth.upToSmall`
     flex-direction: column;
   `};
   `

	const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)

	return (
		<PageWrapper gap="lg" justify="center">
			<TopSection gap="md">
				<DataCard>
					<CardBGImage />
					<CardNoise />
					<CardSection>
						<AutoColumn gap="md">
							<RowBetween>
								<TYPE.white fontWeight={600}>Pangolin liquidity mining</TYPE.white>
							</RowBetween>
							<RowBetween>
								<TYPE.white fontSize={14}>
									Deposit your Pangolin Liquidity Provider PGL tokens to receive PNG, the Pangolin protocol governance token.
                 </TYPE.white>
							</RowBetween>{' '}
							<ExternalLink
								style={{ color: 'white', textDecoration: 'underline' }}
								href="https://pangolin.exchange/litepaper"
								target="_blank"
							>
								<TYPE.white fontSize={14}>Read more about PNG</TYPE.white>
							</ExternalLink>
						</AutoColumn>
					</CardSection>
					<CardBGImage />
					<CardNoise />
				</DataCard>
				<DataCard>
					<CardNoise />
					<CardSection>
						<AutoColumn gap="md">
							<RowBetween>
								<TYPE.white fontWeight={600}>IMPORTANT UPDATE</TYPE.white>
							</RowBetween>
							<RowBetween>
								<TYPE.white fontSize={14}>
									As a result of Pangolin governance proposal 1, Pangolin is changing staking contracts!
									After approximately 08:59 UTC on 4/19, all staking rewards will be distributed to the
									new staking contracts. Before the switch, all rewards will still be distributed to the
									old contracts. To avoid interruptions to yield farming rewards, you need to unstake your
									liquidity from the old contracts and restake in the new contracts. You do not need to
									remove liquidity from your pools or alter your positions.
                                </TYPE.white>
								</RowBetween>
								<RowBetween>
								<TYPE.white fontSize={14}>
									To unstake, go to the old pools, click manage and withdraw your PGL tokens. This will
									also claim any earned PNG. To restake, navigate to the new pools, click manage, and
									then deposit.
                                </TYPE.white>
							</RowBetween>{' '}
							<ExternalLink
								style={{ color: 'white', textDecoration: 'underline' }}
								href="http://pangolin.exchange/#/png/0"
								target="_blank"
							>
								<TYPE.white fontSize={14}>Old PNG pools</TYPE.white>
							</ExternalLink>
							<ExternalLink
								style={{ color: 'white', textDecoration: 'underline' }}
								href="http://pangolin.exchange/#/png/1"
								target="_blank"
							>
								<TYPE.white fontSize={14}>New PNG pools</TYPE.white>
							</ExternalLink>
						</AutoColumn>
					</CardSection>
				</DataCard>
			</TopSection>

			<AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
				<DataRow style={{ alignItems: 'baseline' }}>
					<TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Participating pools</TYPE.mediumHeader>
					<TYPE.black fontWeight={400}>
						The Rewards Never End!
					</TYPE.black>
				</DataRow>

				<PoolSection>
					{stakingRewardsExist && stakingInfos?.length === 0 ? (
						<Loader style={{ margin: 'auto' }} />
					) : !stakingRewardsExist ? (
						'No active rewards'
					) : (
						stakingInfos?.sort(
								function(info_a, info_b) {
									// greater stake in avax comes first
									return info_a.totalStakedInWavax?.greaterThan(info_b.totalStakedInWavax ?? JSBI.BigInt(0)) ? -1 : 1
								}
							).sort(
								function(info_a, info_b) {
									if (info_a.stakedAmount.greaterThan(JSBI.BigInt(0))) {
										if (info_b.stakedAmount.greaterThan(JSBI.BigInt(0)))
											// both are being staked, so we keep the previous sorting
											return 0
										else
											// the second is actually not at stake, so we should bring the first up
											return -1
									} else {
										if (info_b.stakedAmount.greaterThan(JSBI.BigInt(0)))
											// first is not being staked, but second is, so we should bring the first down
											return 1
										else
											// none are being staked, let's keep the  previous sorting
											return 0
									}
							}).map(
								stakingInfo => {
									return <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} version={version} />
								}
							)
					)}
				</PoolSection>
			</AutoColumn>
		</PageWrapper>
	)
}