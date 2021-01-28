import { ChainId, TokenAmount } from '@pangolindex/sdk'
import React, { useMemo } from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'
import tokenLogo from '../../assets/images/token-logo.png'
import { PNG } from '../../constants'
import { useTotalSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
import useCurrentBlockTimestamp from '../../hooks/useCurrentBlockTimestamp'
import { useTotalPngEarned } from '../../state/stake/hooks'
import { useAggregatePngBalance, useTokenBalance } from '../../state/wallet/hooks'
import { StyledInternalLink, TYPE, PngTokenAnimated, ExternalLink } from '../../theme'
import { computePngCirculation } from '../../utils/computePngCirculation'
import useUSDCPrice from '../../utils/useUSDCPrice'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { Break, CardBGImage, CardNoise, CardSection, DataCard } from '../earn/styled'

const ContentWrapper = styled(AutoColumn)`
   width: 100%;
 `

const ModalUpper = styled(DataCard)`
   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
   background: radial-gradient(76.02% 75.41% at 1.84% 0%, #ff007a 0%, #021d43 100%);
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

/**
 * Content for balance stats modal
 */
export default function PngBalanceContent({ setShowPngBalanceModal }: { setShowPngBalanceModal: any }) {
	const { account, chainId } = useActiveWeb3React()
	const png = chainId ? PNG[chainId] : undefined

	const total = useAggregatePngBalance()
	const pngBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, png)
	const pngToClaim: TokenAmount | undefined = useTotalPngEarned()

	const totalSupply: TokenAmount | undefined = useTotalSupply(png)
	const pngPrice = useUSDCPrice(png)
	const blockTimestamp = useCurrentBlockTimestamp()
	const circulation: TokenAmount | undefined = useMemo(
		() =>
			blockTimestamp && png && chainId === ChainId.AVALANCHE
				? computePngCirculation(png, blockTimestamp)
				: totalSupply,
		[blockTimestamp, chainId, totalSupply, png]
	)

	return (
		<ContentWrapper gap="lg">
			<ModalUpper>
				<CardBGImage />
				<CardNoise />
				<CardSection gap="md">
					<RowBetween>
						<TYPE.white color="white">Your PNG Breakdown</TYPE.white>
						<StyledClose stroke="white" onClick={() => setShowPngBalanceModal(false)} />
					</RowBetween>
				</CardSection>
				<Break />
				{account && (
					<>
						<CardSection gap="sm">
							<AutoColumn gap="md" justify="center">
								<PngTokenAnimated width="48px" src={tokenLogo} />{' '}
								<TYPE.white fontSize={48} fontWeight={600} color="white">
									{total?.toFixed(2, { groupSeparator: ',' })}
								</TYPE.white>
							</AutoColumn>
							<AutoColumn gap="md">
								<RowBetween>
									<TYPE.white color="white">Balance:</TYPE.white>
									<TYPE.white color="white">{pngBalance?.toFixed(2, { groupSeparator: ',' })}</TYPE.white>
								</RowBetween>
								<RowBetween>
									<TYPE.white color="white">Unclaimed:</TYPE.white>
									<TYPE.white color="white">
										{pngToClaim?.toFixed(4, { groupSeparator: ',' })}{' '}
										{pngToClaim && pngToClaim.greaterThan('0') && (
											<StyledInternalLink onClick={() => setShowPngBalanceModal(false)} to="/png">
												(claim)
											</StyledInternalLink>
										)}
									</TYPE.white>
								</RowBetween>
							</AutoColumn>
						</CardSection>
						<Break />
					</>
				)}
				<CardSection gap="sm">
					<AutoColumn gap="md">
						<RowBetween>
							<TYPE.white color="white">PNG price:</TYPE.white>
							<TYPE.white color="white">${pngPrice?.toFixed(2) ?? '-'}</TYPE.white>
						</RowBetween>
						<RowBetween>
							<TYPE.white color="white">PNG in circulation:</TYPE.white>
							<TYPE.white color="white">{circulation?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>
						</RowBetween>
						<RowBetween>
							<TYPE.white color="white">Total Supply</TYPE.white>
							<TYPE.white color="white">{totalSupply?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>
						</RowBetween>
						{png && png.chainId === ChainId.AVALANCHE ? (
							<ExternalLink href={`https://pangoon-info.netlify.app/token/${png.address}`}>View PNG Analytics</ExternalLink>
						) : null}
					</AutoColumn>
				</CardSection>
			</ModalUpper>
		</ContentWrapper>
	)
}