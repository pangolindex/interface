import { JSBI, Token, TokenAmount } from '@antiyro/sdk'
import { BigNumber } from 'ethers'

const TREASURY_VESTING_GENESIS = 1612899125

const FOUR_YEARS: number = 60 * 60 * 24 * 365 * 4
const TREASURY_BEGIN_PERIOD_1 = TREASURY_VESTING_GENESIS
const TREASURY_END_YEAR_1 = TREASURY_BEGIN_PERIOD_1 + FOUR_YEARS

const TREASURY_BEGIN_PERIOD_2 = TREASURY_END_YEAR_1
const TREASURY_END_YEAR_2 = TREASURY_BEGIN_PERIOD_2 + FOUR_YEARS

const TREASURY_BEGIN_PERIOD_3 = TREASURY_END_YEAR_2
const TREASURY_END_YEAR_3 = TREASURY_BEGIN_PERIOD_3 + FOUR_YEARS

const TREASURY_BEGIN_PERIOD_4 = TREASURY_END_YEAR_3
const TREASURY_END_YEAR_4 = TREASURY_BEGIN_PERIOD_4 + FOUR_YEARS

const AIRDROP_AMOUNT = 26_000_000
const TREASURY_PERIOD_1_AMOUNT = 256_000_000
const TREASURY_PERIOD_2_AMOUNT = 128_000_000
const TREASURY_PERIOD_3_AMOUNT = 64_000_000
const TREASURY_PERIOD_4_AMOUNT = 32_000_000

function withVesting(before: JSBI, time: BigNumber, amount: number, start: number, end: number, cliff?: number) {
  if (time.gt(start)) {
    if (time.gte(end)) {
      return JSBI.add(before, JSBI.BigInt(amount))
    } else {
      if ((typeof cliff === 'number' && time.gte(cliff)) || typeof cliff === 'undefined') {
        return JSBI.add(
          before,
          JSBI.divide(
            JSBI.multiply(JSBI.BigInt(amount), JSBI.BigInt(time.sub(start).toString())),
            JSBI.subtract(JSBI.BigInt(end), JSBI.BigInt(start))
          )
        )
      }
    }
  }
  return before
}

export function computePngCirculation(png: Token, blockTimestamp: BigNumber): TokenAmount {
  let wholeAmount = JSBI.BigInt(AIRDROP_AMOUNT)

  // treasury vesting
  wholeAmount = withVesting(
    wholeAmount,
    blockTimestamp,
    TREASURY_PERIOD_1_AMOUNT,
    TREASURY_BEGIN_PERIOD_1,
    TREASURY_END_YEAR_1
  )
  wholeAmount = withVesting(
    wholeAmount,
    blockTimestamp,
    TREASURY_PERIOD_2_AMOUNT,
    TREASURY_BEGIN_PERIOD_2,
    TREASURY_END_YEAR_2
  )
  wholeAmount = withVesting(
    wholeAmount,
    blockTimestamp,
    TREASURY_PERIOD_3_AMOUNT,
    TREASURY_BEGIN_PERIOD_3,
    TREASURY_END_YEAR_3
  )
  wholeAmount = withVesting(
    wholeAmount,
    blockTimestamp,
    TREASURY_PERIOD_4_AMOUNT,
    TREASURY_BEGIN_PERIOD_4,
    TREASURY_END_YEAR_4
  )

  return new TokenAmount(png, JSBI.multiply(wholeAmount, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))))
}
