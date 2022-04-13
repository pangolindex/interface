import { Percent } from '@pangolindex/sdk'
import { ALLOWED_PRICE_IMPACT_HIGH, PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN } from '../../constants'
import i18next from '../../i18n'

/**
 * Given the price impact, get user confirmation.
 *
 * @param priceImpactWithoutFee price impact of the trade without the fee.
 */
export default function confirmPriceImpactWithoutFee(priceImpactWithoutFee: Percent): boolean {
  if (!priceImpactWithoutFee.lessThan(PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN)) {
    return (
      window.prompt(
        i18next.t('swap.priceImpactMinPrompt', { priceImpact: PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN.toFixed(0) })
      ) === i18next.t('swap.confirm')
    )
  } else if (!priceImpactWithoutFee.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) {
    return window.confirm(
      i18next.t('swap.priceImpactHighPrompt', { priceImpact: ALLOWED_PRICE_IMPACT_HIGH.toFixed(0) })
    )
  }
  return true
}
