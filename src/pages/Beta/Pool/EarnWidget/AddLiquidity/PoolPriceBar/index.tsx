import React from 'react'
import { Currency, Percent, Price, CurrencyAmount, CHAINS } from '@pangolindex/sdk'
import { Box, useTranslation } from '@pangolindex/components'
import Stat from 'src/components/Stat'
import { Root, GridContainer } from './styled'
import { Field } from 'src/state/mint/actions'
import { ONE_BIPS } from 'src/constants'
import { useUSDCPrice } from 'src/utils/useUSDCPrice'
import { useChainId } from 'src/hooks'

interface BarProps {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
  parsedAmounts: { [field in Field]?: CurrencyAmount }
}

const PoolPriceBar = ({ currencies, noLiquidity, poolTokenPercentage, price, parsedAmounts }: BarProps) => {
  const { t } = useTranslation()
  const currency0InputValue = parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)
  const chainId = useChainId()

  const currency0 = currencies[Field.CURRENCY_A]
  const currency0PriceTmp = useUSDCPrice(currency0)
  const currency0Price = CHAINS[chainId]?.mainnet ? currency0PriceTmp : undefined
  const multipyAmount = currency0Price ? Number(currency0Price.toFixed()) * 2 * Number(currency0InputValue) : 0

  return (
    <Root>
      <GridContainer>
        <Box>
          <Stat
            title={`${t('migratePage.dollarWorth')}`}
            stat={`${multipyAmount ? `$${multipyAmount?.toFixed(4)}` : '-'}`}
            titlePosition="top"
            titleFontSize={12}
            statFontSize={14}
            titleColor="text2"
          />
        </Box>

        <Box>
          <Stat
            title={`${t('addLiquidity.shareOfPool')}`}
            stat={`${
              noLiquidity && price
                ? '100'
                : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'
            }
            %`}
            titlePosition="top"
            titleFontSize={12}
            statFontSize={14}
            titleColor="text2"
          />
        </Box>
      </GridContainer>
    </Root>
  )
}
export default PoolPriceBar
