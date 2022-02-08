import React, { useContext, useCallback, useEffect, useState } from 'react'
import { Currency, CAVAX, JSBI, TokenAmount } from '@pangolindex/sdk'
import { Box, Text, CurrencyLogo } from '@pangolindex/components'
import { PageWrapper, ArrowWrapper, CurrencySelectWrapper, LightCard, Dots } from './styleds'
import { Plus, ChevronDown } from 'react-feather'
import { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { PairState, usePair } from 'src/data/Reserves'
import { useActiveWeb3React } from 'src/hooks'
import { usePairAdder } from 'src/state/user/hooks'
import { useTokenBalance } from 'src/state/wallet/hooks'
import SelectTokenDrawer from '../../../Swap/SelectTokenDrawer'
import PositionCard from '../PositionCard'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1
}

interface ClaimProps {
  onClose: () => void
}
const PoolImport = ({ onClose }: ClaimProps) => {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)

  const [currency0, setCurrency0] = useState<Currency | undefined>(CAVAX)
  const [currency1, setCurrency1] = useState<Currency | undefined>(undefined)

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()
  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
    )

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)))

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField]
  )

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false)
  }, [setShowSearch])

  const prerequisiteMessage = (
    <LightCard>
      <Text textAlign="center" color="color6" fontSize={14}>
        {!account ? t('poolFinder.connectToFind') : t('poolFinder.selectTokenToFind')}
      </Text>
    </LightCard>
  )

  return (
    <PageWrapper>
      <CurrencySelectWrapper
        onClick={() => {
          setShowSearch(true)
          setActiveField(Fields.TOKEN0)
        }}
      >
        <Box display="flex" alignItems="center">
          <CurrencyLogo size="24px" currency={currency0} />
          <Text color="text2" fontSize={16} fontWeight={500} lineHeight="40px" marginLeft={10}>
            {currency0?.symbol}
          </Text>
        </Box>
        <ChevronDown size="16" color={theme.text1} />
      </CurrencySelectWrapper>

      <Box width="100%" textAlign="center" alignItems="center" display="flex" justifyContent={'center'} mt={10} mb={10}>
        <ArrowWrapper>
          <Plus size="16" color={theme.text1} />
        </ArrowWrapper>
      </Box>

      <CurrencySelectWrapper
        onClick={() => {
          setShowSearch(true)
          setActiveField(Fields.TOKEN1)
        }}
      >
        {currency1 ? (
          <Box display="flex" alignItems="center">
            <CurrencyLogo size="24px" currency={currency1} />
            <Text color="text2" fontSize={16} fontWeight={500} lineHeight="40px" marginLeft={10}>
              {currency1?.symbol}
            </Text>
          </Box>
        ) : (
          <Text color="text1" fontSize={16} fontWeight={500} padding="8px 0px">
            {t('searchModal.selectToken')}
          </Text>
        )}

        <ChevronDown size="16" color={theme.text1} />
      </CurrencySelectWrapper>

      {currency0 && currency1 ? (
        pairState === PairState.EXISTS ? (
          hasPosition && pair ? (
            <PositionCard pair={pair} />
          ) : (
            <LightCard>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Text color="color6" fontSize={14} textAlign="center">
                  {t('poolFinder.noLiquidityYet')}
                </Text>
                <Text color="primary" fontSize={14} textAlign="center" onClick={() => {}} cursor="pointer">
                  {t('poolFinder.addLiquidity')}
                </Text>
              </Box>
            </LightCard>
          )
        ) : validPairNoLiquidity ? (
          <LightCard>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Text color="color6" fontSize={14} textAlign="center">
                {t('poolFinder.noPoolFound')}
              </Text>
              <Text color="primary" fontSize={14} textAlign="center" onClick={() => {}} cursor="pointer">
                {t('poolFinder.createPool')}
              </Text>
            </Box>
          </LightCard>
        ) : pairState === PairState.INVALID ? (
          <LightCard>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Text color="color6" fontSize={14} textAlign="center" fontWeight={500}>
                {t('poolFinder.invalidPair')}
              </Text>
            </Box>
          </LightCard>
        ) : pairState === PairState.LOADING ? (
          <LightCard>
            <Box textAlign="center">
              <Text textAlign="center">
                {t('poolFinder.loading')}
                <Dots />
              </Text>
            </Box>
          </LightCard>
        ) : null
      ) : (
        prerequisiteMessage
      )}

      <SelectTokenDrawer
        isOpen={showSearch}
        onClose={handleSearchDismiss}
        onCurrencySelect={handleCurrencySelect}
        selectedCurrency={activeField === Fields.TOKEN0 ? currency0 : currency1}
        otherSelectedCurrency={activeField === Fields.TOKEN0 ? currency1 : currency0}
      />
    </PageWrapper>
  )
}
export default PoolImport
