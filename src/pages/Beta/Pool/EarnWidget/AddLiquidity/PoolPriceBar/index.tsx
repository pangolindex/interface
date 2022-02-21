import React from 'react'
import { Currency, Percent, Price, CurrencyAmount } from '@antiyro/sdk'
import { Box } from '@0xkilo/components'
import Stat from 'src/components/Stat'
import { Root, GridContainer } from './styled'
import { Field } from 'src/state/mint/actions'
import { useTranslation } from 'react-i18next'
import { ONE_BIPS } from 'src/constants'
import useUSDCPrice from 'src/utils/useUSDCPrice'

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

  const currency0 = currencies[Field.CURRENCY_A]
  const currency0Price = useUSDCPrice(currency0)
  const multipyAmount = currency0Price ? Number(currency0Price.toFixed()) * 2 * Number(currency0InputValue) : 0

  return (
    <Root>
      <GridContainer>
        <Box>
          <Stat
            title={`${t('migratePage.dollarWorth')}`}
            stat={`${multipyAmount ? `$${multipyAmount?.toFixed(4)}` : '-'}`}
            titlePosition="top"
            titleFontSize={14}
            statFontSize={18}
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
            titleFontSize={14}
            statFontSize={18}
            titleColor="text2"
          />
        </Box>
      </GridContainer>
    </Root>
  )
}
export default PoolPriceBar
