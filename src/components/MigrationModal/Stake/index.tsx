import React, { useState, useEffect } from 'react'
import { Wrapper } from './styleds'
import { Box, Button } from '@pangolindex/components'
import { Pair, JSBI, TokenAmount, ChainId } from '@pangolindex/sdk'
import PoolInfo from '../PoolInfo'
import { StakingInfo } from '../../../state/stake/hooks'
import { tryParseAmount } from '../../../state/swap/hooks'
import { useActiveWeb3React } from '../../../hooks'
import { useTokenBalance } from '../../../state/wallet/hooks'
import { RowBetween } from '../../Row'
import { useTranslation } from 'react-i18next'
import { useTransactionAdder } from '../../../state/transactions/hooks'
import { usePairContract, useStakingContract } from '../../../hooks/useContract'
import { useApproveCallback, ApprovalState } from '../../../hooks/useApproveCallback'
import { TransactionResponse } from '@ethersproject/providers'
import { MINICHEF_ADDRESS } from '../../../constants'
import { useDerivedStakeInfo, useMinichefPools } from '../../../state/stake/hooks'
import useTransactionDeadline from '../../../hooks/useTransactionDeadline'
import { splitSignature } from 'ethers/lib/utils'

export interface StakeProps {
  allChoosePool: { [address: string]: { pair: Pair; staking: StakingInfo } }
  allChoosePoolLength: number
  setCompleted: () => void
}

const Stake = ({ allChoosePool, allChoosePoolLength, setCompleted }: StakeProps) => {
  const { account, chainId, library } = useActiveWeb3React()

  const [index, setIndex] = useState(0)

  const { t } = useTranslation()
  const deadline = useTransactionDeadline()

  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)

  // state for pending and submitted txn views
  const addTransaction = useTransactionAdder()
  const [attempting, setAttempting] = useState<boolean>(false)
  const [isGreaterThan, setIsGreaterThan] = useState(false as boolean)

  let pair = Object.values(allChoosePool)?.[index]?.pair
  let stakingInfo = Object.values(allChoosePool)?.[index]?.staking

  // pair contract for this token to be staked
  const dummyPair = new Pair(
    new TokenAmount(stakingInfo.tokens[0], '0'),
    new TokenAmount(stakingInfo.tokens[1], '0'),
    chainId ? chainId : ChainId.AVALANCHE
  )
  const pairContract = usePairContract(dummyPair.liquidityToken.address)

  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, pair.liquidityToken) as TokenAmount
  const [stakingAmount, setStakingAmount] = useState('')

  const { parsedAmount } = useDerivedStakeInfo(stakingAmount, stakingInfo.stakedAmount.token, userLiquidityUnstaked)

  const [percentage, setPercentage] = useState(0)
  // approval data for stake
  const [approval, approveCallback] = useApproveCallback(parsedAmount, MINICHEF_ADDRESS)

  useEffect(() => {
    if (percentage) {
      const newAmount = (userLiquidityUnstaked as TokenAmount)
        .multiply(JSBI.BigInt(percentage * 25))
        .divide(JSBI.BigInt(100)) as TokenAmount
      setStakingAmount(newAmount.toSignificant(4))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage])

  const onChangeAmount = (value: string) => {
    setPercentage(0)
    setStakingAmount(value)
  }

  useEffect(() => {
    let stakingToken = stakingInfo?.stakedAmount?.token
    const parsedInput = tryParseAmount(stakingAmount, stakingToken) as TokenAmount

    if (parsedInput && stakingInfo?.stakedAmount && JSBI.greaterThan(parsedInput.raw, userLiquidityUnstaked.raw)) {
      setIsGreaterThan(true)
    } else {
      setIsGreaterThan(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakingAmount])

  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress)
  const poolMap = useMinichefPools()

  const miniChefContract = useStakingContract(MINICHEF_ADDRESS)

  async function onStake() {
    setAttempting(true)

    let stakingToken = stakingInfo?.stakedAmount?.token
    const parsedInput = tryParseAmount(stakingAmount, stakingToken) as TokenAmount

    if (
      miniChefContract &&
      stakingContract &&
      parsedInput &&
      userLiquidityUnstaked &&
      JSBI.lessThanOrEqual(parsedInput.raw, userLiquidityUnstaked.raw) &&
      deadline
    ) {
      if (approval === ApprovalState.APPROVED) {
        // stakingContract
        //   .stake(`0x${parsedInput.raw.toString(16)}`, { gasLimit: 350000 })
        miniChefContract
          .deposit(poolMap[pair?.liquidityToken?.address], `0x${parsedAmount?.raw.toString(16)}`, account)
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: t('earn.depositLiquidity')
            })

            setAttempting(false)
            afterStake()
          })
          .catch((error: any) => {
            setAttempting(false)
            console.error(error)
          })
      } else if (signatureData) {
        miniChefContract
          .depositWithPermit(
            poolMap[stakingInfo.stakedAmount.token.address],
            `0x${parsedInput.raw.toString(16)}`,
            account,
            signatureData.deadline,
            signatureData.v,
            signatureData.r,
            signatureData.s
          )
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: t('earn.depositLiquidity')
            })
          })
          .catch((error: any) => {
            setAttempting(false)
            console.error(error)
          })
      } else {
        setAttempting(false)
        throw new Error(t('earn.attemptingToStakeError'))
      }
    }
  }

  async function onAttemptToApprove() {
    if (!pairContract || !library || !deadline) throw new Error(t('earn.missingDependencies'))
    const liquidityAmount = parsedAmount
    if (!liquidityAmount) throw new Error(t('earn.missingLiquidityAmount'))

    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account)

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ]
    const domain = {
      name: 'Pangolin Liquidity',
      version: '2',
      chainId: chainId,
      verifyingContract: pairContract.address
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ]
    const message = {
      owner: account,
      spender: stakingInfo.stakingRewardAddress,
      value: liquidityAmount.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadline.toNumber()
    }
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit
      },
      domain,
      primaryType: 'Permit',
      message
    })

    library
      .send('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then(signature => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadline.toNumber()
        })
      })
      .catch(error => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (error?.code !== 4001) {
          approveCallback()
        }
      })
  }

  // async function onAttemptToApprove() {
  //   const liquidityAmount = stakingAmount
  //   if (!liquidityAmount) throw new Error(t('earn.missingLiquidityAmount'))

  //   approveCallback().catch(error => {
  //     // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
  //     if (error?.code !== 4001) {
  //       approveCallback()
  //     }
  //   })
  // }

  const afterStake = () => {
    if (index === allChoosePoolLength - 1) {
      setCompleted()
    } else {
      const newIndex = index + 1
      setIndex(newIndex)
    }
  }

  let error: string | undefined
  if (!account) {
    error = t('earn.connectWallet')
  }
  if (!userLiquidityUnstaked) {
    error = error ?? t('earn.enterAmount')
  }

  return (
    <Wrapper>
      <PoolInfo
        pair={pair}
        type="stake"
        percentage={percentage}
        onChangePercentage={(value: number) => {
          setPercentage(value)
        }}
        amount={stakingAmount}
        onChangeAmount={(value: string) => {
          onChangeAmount(value)
        }}
        userPoolBalance={userLiquidityUnstaked}
      />

      <Box mt={10}>
        <RowBetween>
          <Box mr="5px" width="100%">
            <Button
              variant={approval === ApprovalState.APPROVED ? 'confirm' : 'primary'}
              onClick={onAttemptToApprove}
              isDisabled={attempting || approval !== ApprovalState.NOT_APPROVED || isGreaterThan}
              loading={attempting}
              loadingText={t('migratePage.loading')}
            >
              {t('earn.approve')} {allChoosePoolLength > 1 && `${index + 1}/${allChoosePoolLength}`}
            </Button>
          </Box>
          <Box width="100%">
            <Button
              variant="primary"
              isDisabled={attempting || !!error || approval !== ApprovalState.APPROVED || isGreaterThan}
              onClick={onStake}
              loading={attempting}
              loadingText={t('migratePage.loading')}
            >
              {error ?? t('earn.deposit')} {allChoosePoolLength > 1 && `${index + 1}/${allChoosePoolLength}`}
            </Button>
          </Box>
        </RowBetween>
      </Box>
    </Wrapper>
  )
}
export default Stake
