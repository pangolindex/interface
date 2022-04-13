import { TokenAmount, JSBI, ChainId } from '@antiyro/sdk'
import React, { useMemo, useState } from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'
import tokenLogo from '../../assets/images/token-logo.png'
import { injected } from '../../connectors'
import { CHAINS } from '../../constants/chains'
import { getTokenLogoURL, PANGOLIN_API_BASE_URL } from '../../constants'
import { PNG } from '../../constants/tokens'
import { useTotalSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
import { useTotalPngEarned } from '../../state/stake/hooks'
import { DOUBLE_SIDE_STAKING_REWARDS_CURRENT_VERSION } from '../../state/stake/doubleSideConfig'
import { useAggregatePngBalance, useTokenBalance } from '../../state/wallet/hooks'
import { StyledInternalLink, TYPE, PngTokenAnimated } from '../../theme'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { Break, CardBGImage, CardNoise, CardSection, DataCard } from '../earn/styled'
import { useTranslation } from 'react-i18next'
import useUSDCPrice from '../../utils/useUSDCPrice'
import { useChainId } from 'src/hooks'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ModalUpper = styled(DataCard)`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #f97316 0%, #e84142 100%);
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
const AddPNG = styled.span`
  width: 100%;
  height: 100%;
  font-weight: 500;
  font-size: 32;
  padding: 4px 6px;
  align-items: center;
  text-align: center;
  background-color: ${({ theme }) => theme.bg3};
  background: radial-gradient(174.47% 188.91% at 1.84% 0%, #f97316 0%, #e84142 100%), #edeef2;
  border-radius: 12px;
  white-space: nowrap;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`

/**
 * Content for balance stats modal
 */
export default function PngBalanceContent({ setShowPngBalanceModal }: { setShowPngBalanceModal: any }) {
  const { account } = useActiveWeb3React()
  const chainId = useChainId()
  const png = chainId ? PNG[chainId] : undefined

  const total = useAggregatePngBalance()
  const pngBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, png)
  const pngToClaim: TokenAmount | undefined = useTotalPngEarned()

  const totalSupply: TokenAmount | undefined = useTotalSupply(png)

  // Determine PNG price in AVAX
  const oneToken = JSBI.BigInt(1000000000000000000)
  const { t } = useTranslation()

  const usdcPriceTmp = useUSDCPrice(png)
  const usdcPrice = CHAINS[chainId].is_mainnet ? usdcPriceTmp : undefined

  let pngPrice

  if (usdcPrice && png) {
    pngPrice = usdcPrice.quote(new TokenAmount(png, oneToken), chainId)
  }

  const [circulation, setCirculation] = useState(totalSupply)

  useMemo(() => {
    if (png === undefined) return
    fetch(`${PANGOLIN_API_BASE_URL}/png/circulating-supply`)
      .then(res => res.text())
      .then(val => setCirculation(new TokenAmount(png, val)))
  }, [png])

  return (
    <ContentWrapper gap="lg">
      <ModalUpper>
        <CardBGImage />
        <CardNoise />
        <CardSection gap="md">
          <RowBetween>
            <TYPE.white color="white">{t('header.pngBreakDown')}</TYPE.white>
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
                  <TYPE.white color="white">{t('header.balance')}</TYPE.white>
                  <TYPE.white color="white">{pngBalance?.toFixed(2, { groupSeparator: ',' })}</TYPE.white>
                </RowBetween>
                <RowBetween>
                  <TYPE.white color="white">{t('header.unclaimed')}</TYPE.white>
                  <TYPE.white color="white">
                    {pngToClaim?.toFixed(4, { groupSeparator: ',' })}{' '}
                    {pngToClaim && pngToClaim.greaterThan('0') && (
                      <StyledInternalLink
                        onClick={() => setShowPngBalanceModal(false)}
                        to={`/png/${DOUBLE_SIDE_STAKING_REWARDS_CURRENT_VERSION}`}
                      >
                        ({t('earn.claim')})
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
              <TYPE.white color="white">{t('header.pngPrice')}</TYPE.white>
              <TYPE.white color="white">${pngPrice?.toFixed(2, { groupSeparator: ',' }) ?? '-'}</TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white color="white">{t('header.pngCirculation')}</TYPE.white>
              <TYPE.white color="white">{circulation?.toFixed(0, { groupSeparator: ',' }) ?? '-'}</TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white color="white">{t('header.totalSupply')}</TYPE.white>
              <TYPE.white color="white">{totalSupply?.toFixed(0, { groupSeparator: ',' }) ?? '-'}</TYPE.white>
            </RowBetween>
          </AutoColumn>
        </CardSection>
        {account && (
          <>
            <CardSection gap="sm">
              <AutoColumn gap="md">
                <AddPNG
                  onClick={() => {
                    injected.getProvider().then(provider => {
                      if (provider) {
                        provider
                          .request({
                            method: 'wallet_watchAsset',
                            params: {
                              type: 'ERC20',
                              options: {
                                address: png?.address,
                                symbol: png?.symbol,
                                decimals: png?.decimals,
                                image: getTokenLogoURL(PNG[ChainId.AVALANCHE].address, 48)
                              }
                            }
                          })
                          .catch((error: any) => {
                            console.error(error)
                          })
                      }
                    })
                  }}
                >
                  <TYPE.white color="white">{t('header.addMetamask')}</TYPE.white>
                </AddPNG>
              </AutoColumn>
            </CardSection>
          </>
        )}
      </ModalUpper>
    </ContentWrapper>
  )
}
