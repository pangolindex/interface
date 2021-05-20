import React from 'react'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import styled from 'styled-components'
import { TYPE, StyledInternalLink } from '../../theme'
import DoubleCurrencyLogo from '../DoubleLogo'
import { CAVAX, JSBI, Token, Fraction } from '@pangolindex/sdk'
import { ButtonPrimary } from '../Button'
import { StakingInfo } from '../../state/stake/hooks'
import { useColor } from '../../hooks/useColor'
import { currencyId } from '../../utils/currencyId'
import { Break, CardNoise, CardBGImage } from './styled'
import { unwrappedToken } from '../../utils/wrappedCurrency'
// import useUSDCPrice from '../../utils/useUSDCPrice'
import { PNG } from '../../constants'

const StatContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
   display: none;
 `};
`

const Wrapper = styled(AutoColumn)<{ showBackground: boolean; bgColor: any }>`
  border-radius: 12px;
  width: 100%;
  overflow: hidden;
  position: relative;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '1')};
  background: ${({ theme, bgColor, showBackground }) =>
    `radial-gradient(91.85% 100% at 1.84% 0%, ${bgColor} 0%, ${showBackground ? theme.black : theme.bg5} 100%) `};
  color: ${({ theme, showBackground }) => (showBackground ? theme.white : theme.text1)} !important;

  ${({ showBackground }) =>
    showBackground &&
    `  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
     0px 24px 32px rgba(0, 0, 0, 0.01);`}
`

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr 120px;
  grid-gap: 0px;
  align-items: center;
  padding: 1rem;
  z-index: 1;
  ${({ theme }) => theme.mediaWidth.upToSmall`
     grid-template-columns: 48px 1fr 96px;
   `};
`

// const APR = styled.div`
//   display: flex;
//   justify-content: flex-end;
// `

const BottomSection = styled.div<{ showBackground: boolean }>`
  padding: 12px 16px;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '0.4')};
  border-radius: 0 0 12px 12px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  z-index: 1;
`

export default function PoolCard({
  stakingInfo,
  version,
  apr
}: {
  stakingInfo: StakingInfo
  version: string
  apr: string
}) {
  const token0 = stakingInfo.tokens[0]
  const token1 = stakingInfo.tokens[1]

  const currency0 = unwrappedToken(token0)
  const currency1 = unwrappedToken(token1)

  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))

  const avaxPool = currency0 === CAVAX || currency1 === CAVAX
  let token: Token
  if (avaxPool) {
    token = currency0 === CAVAX ? token1 : token0
  } else {
    token = token0.equals(PNG[token0.chainId]) ? token1 : token0
  }
  // let valueOfTotalStakedAmountInUSDC: CurrencyAmount | undefined
  // get the color of the token
  let backgroundColor = useColor(token)

  // let usdToken: Token
  // const USDPrice = useUSDCPrice(usdToken)
  // valueOfTotalStakedAmountInUSDC =
  // valueOfTotalStakedAmountInWavax && USDPrice?.quote(valueOfTotalStakedAmountInWavax)
  let weeklyRewardAmount = stakingInfo.totalRewardRate.multiply(JSBI.BigInt(60 * 60 * 24 * 7))
  let weeklyRewardPerAvax = weeklyRewardAmount.divide(stakingInfo.totalStakedInWavax)
  if (JSBI.EQ(weeklyRewardPerAvax.denominator, 0)) {
    weeklyRewardPerAvax = new Fraction(JSBI.BigInt(0), JSBI.BigInt(1))
  }

  return (
    <Wrapper showBackground={isStaking} bgColor={backgroundColor}>
      <CardBGImage desaturate />
      <CardNoise />

      <TopSection>
        <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} />
        <TYPE.white fontWeight={600} fontSize={24} style={{ marginLeft: '8px' }}>
          {currency0.symbol}-{currency1.symbol}
        </TYPE.white>

        <StyledInternalLink
          to={`/png/${currencyId(currency0)}/${currencyId(currency1)}/${version}`}
          style={{ width: '100%' }}
        >
          <ButtonPrimary padding="8px" borderRadius="8px">
            {isStaking ? 'Manage' : 'Deposit'}
          </ButtonPrimary>
        </StyledInternalLink>
      </TopSection>

      <StatContainer>
        <RowBetween>
          <TYPE.white> Total deposited</TYPE.white>
          <TYPE.white>
            {`${stakingInfo.totalStakedInWavax.toSignificant(4, { groupSeparator: ',' }) ?? '-'} AVAX`}
            {/* {valueOfTotalStakedAmountInUSDC
							? `$${valueOfTotalStakedAmountInUSDC.toFixed(0, { groupSeparator: ',' })}`
							: `${valueOfTotalStakedAmountInWavax?.toSignificant(4, { groupSeparator: ',' }) ?? '-'} AVAX`} */}
          </TYPE.white>
        </RowBetween>
        <RowBetween>
          <TYPE.white> Pool rate </TYPE.white>
          <TYPE.white>{`${weeklyRewardAmount.toFixed(0, { groupSeparator: ',' })} PNG / week`}</TYPE.white>
        </RowBetween>
        <RowBetween>
          <TYPE.white> Current reward </TYPE.white>
          <TYPE.white>{`${weeklyRewardPerAvax.toFixed(4, { groupSeparator: ',' }) ??
            '-'} PNG / Week per AVAX`}</TYPE.white>
        </RowBetween>
        <RowBetween>
          <TYPE.white> Earn up to (yearly) </TYPE.white>
          <TYPE.white>{`${apr}%`}</TYPE.white>
        </RowBetween>
      </StatContainer>

      {isStaking && (
        <>
          <Break />
          <BottomSection showBackground={true}>
            <TYPE.black color={'white'} fontWeight={500}>
              <span>Your rate</span>
            </TYPE.black>

            <TYPE.black style={{ textAlign: 'right' }} color={'white'} fontWeight={500}>
              <span role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
                ⚡
              </span>
              {`${stakingInfo.rewardRate
                ?.multiply(`${60 * 60 * 24 * 7}`)
                ?.toSignificant(4, { groupSeparator: ',' })} PNG / week`}
            </TYPE.black>
          </BottomSection>
        </>
      )}
    </Wrapper>
  )
}
