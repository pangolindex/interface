import React, { useState, useEffect, useMemo } from 'react'
import { Wrapper } from './styleds'
import { Text, Steps, Step, Box } from '@pangolindex/components'
import { useTranslation } from 'react-i18next'
import ChoosePool from '../ChoosePool'
import Unstake from '../Unstake'
import Stake from '../Stake'
import Remove from '../Remove'
import Add from '../Add'
import { Pair, ChainId } from '@pangolindex/sdk'
import { useActiveWeb3React } from '../../../hooks'
import { usePairs } from '../../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../../state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from '../../../state/wallet/hooks'

export interface StepProps {
  selectedPool?: Pair
}

const StepView = ({ selectedPool }: StepProps) => {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [allChoosePool, setAllChoosePool] = useState({} as { [address: string]: Pair })

  const handleChange = (step: number) => {
    setCurrentStep(step)
  }

  useEffect(() => {
    if (selectedPool) {
      setCurrentStep(1)
      let container = {} as { [address: string]: Pair }
      let address = selectedPool?.liquidityToken?.address
      container[address] = selectedPool

      setAllChoosePool({ ...container })
    }
  }, [selectedPool])

  const { account, chainId } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()

  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map(tokens => ({
        liquidityToken: toV2LiquidityToken(tokens, chainId ? chainId : ChainId.AVALANCHE),
        tokens
      })),
    [trackedTokenPairs, chainId]
  )

  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])

  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))

  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const v2PairData = useMemo(
    () =>
      allV2PairsWithLiquidity.reduce<{ [address: string]: Pair }>((memo, v2Pair, i) => {
        memo[v2Pair?.liquidityToken?.address] = v2Pair
        return memo
      }, {}),
    [allV2PairsWithLiquidity]
  )

  const toggleSelectAll = (check: boolean) => {
    if (check) {
      setAllChoosePool({ ...v2PairData })
    } else {
      setAllChoosePool({})
    }
  }

  const toggleIndividualSelect = (address: string) => {
    if (!!allChoosePool[address]) {
      let newAllChoosePool = allChoosePool
      delete newAllChoosePool[address]
      setAllChoosePool({ ...newAllChoosePool })
    } else {
      let newObject = v2PairData[address]
      let container = {} as { [address: string]: Pair }
      container[address] = newObject
      setAllChoosePool({ ...allChoosePool, ...container })
    }
  }

  const goNext = () => {
    let newStep = currentStep + 1
    setCurrentStep(newStep)
  }

  return (
    <Wrapper>
      <Text color="text1" fontSize={32}>
        {t('migratePage.migrate')}
      </Text>

      <Box mt={10}>
        <Steps onChange={handleChange} current={currentStep}>
          <Step title="Choose" />
          <Step title="Unstake" />
          <Step title="Remove" />
          <Step title="Add" />
          <Step title="Stake" />
        </Steps>
        {currentStep === 0 && (
          <ChoosePool
            allChoosePool={allChoosePool}
            v2PairData={v2PairData}
            v2IsLoading={v2IsLoading}
            toggleSelectAll={toggleSelectAll}
            toggleIndividualSelect={toggleIndividualSelect}
            goNext={goNext}
          />
        )}
        {currentStep === 1 && (
          <Unstake
            allChoosePool={allChoosePool}
            goNext={goNext}
            allChoosePoolLength={(Object.keys(allChoosePool) || []).length}
          />
        )}

        {currentStep === 2 && (
          <Remove
            allChoosePool={allChoosePool}
            goNext={goNext}
            allChoosePoolLength={(Object.keys(allChoosePool) || []).length}
          />
        )}
        {currentStep === 3 && (
          <Add
            allChoosePool={allChoosePool}
            goNext={goNext}
            allChoosePoolLength={(Object.keys(allChoosePool) || []).length}
          />
        )}
        {currentStep === 4 && (
          <Stake
            allChoosePool={allChoosePool}
            goNext={goNext}
            allChoosePoolLength={(Object.keys(allChoosePool) || []).length}
          />
        )}
      </Box>
    </Wrapper>
  )
}
export default StepView
