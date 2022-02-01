import React, { useState, useContext } from 'react'
import { Box, Text, Button } from '@pangolindex/components'
import { PageWrapper, PendingWrapper, SubmittedWrapper, Root, Footer, Header, Link } from './styleds'
import { ArrowUpCircle } from 'react-feather'
import { ThemeContext } from 'styled-components'
import { StakingInfo } from 'src/state/stake/hooks'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'src/state/transactions/hooks'
import { useActiveWeb3React } from 'src/hooks'
import { useTranslation } from 'react-i18next'
import { useMinichefPools, useMinichefPendingRewards } from 'src/state/stake/hooks'
import { useStakingContract } from 'src/hooks/useContract'
import { CustomLightSpinner } from 'src/theme'
import Circle from 'src/assets/images/blue-loader.svg'
import { getEtherscanLink } from 'src/utils'
import FormattedCurrencyAmount from 'src/components/FormattedCurrencyAmount'

interface WithdrawProps {
  stakingInfo: StakingInfo
  version: number
  onClose: () => void
}
const Withdraw = ({ stakingInfo, version, onClose }: WithdrawProps) => {
  const { account, chainId } = useActiveWeb3React()

  const { t } = useTranslation()
  const theme = useContext(ThemeContext)

  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState(false)

  const poolMap = useMinichefPools()
  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress)

  const { rewardTokensAmount } = useMinichefPendingRewards(stakingInfo)

  let isSuperFarm = (rewardTokensAmount || [])?.length > 0

  async function onWithdraw() {
    if (stakingContract && poolMap && stakingInfo?.stakedAmount) {
      setAttempting(true)
      const method = version < 2 ? 'exit' : 'withdrawAndHarvest'
      const args =
        version < 2
          ? []
          : [
              poolMap[stakingInfo.stakedAmount.token.address],
              `0x${stakingInfo.stakedAmount?.raw.toString(16)}`,
              account
            ]

      // TODO: Support withdrawing partial amounts for v2+
      await stakingContract[method](...args)
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: t('earn.withdrawDepositedLiquidity')
          })
          setHash(response.hash)
        })
        .catch((error: any) => {
          setAttempting(false)
          console.log(error)
        })
    }
  }

  let error: string | undefined
  if (!account) {
    error = t('earn.connectWallet')
  }
  if (!stakingInfo?.stakedAmount) {
    error = error ?? t('earn.enterAmount')
  }

  return (
    <PageWrapper>
      {!attempting && !hash && (
        <Root>
          <Header>
            <Box>
              {stakingInfo?.stakedAmount && (
                <Box textAlign="center">
                  <Text fontSize="26px" fontWeight={500} marginRight={10} color="text1">
                    {<FormattedCurrencyAmount currencyAmount={stakingInfo.stakedAmount} />}
                  </Text>
                  <Text fontSize="16px" color="text1" lineHeight="40px">
                    {t('earn.depositedPglLiquidity')}
                  </Text>
                </Box>
              )}
              {stakingInfo?.earnedAmount && (
                <Box textAlign="center">
                  <Text fontSize="26px" fontWeight={500} marginRight={10} color="text1">
                    {<FormattedCurrencyAmount currencyAmount={stakingInfo.earnedAmount} />}
                  </Text>
                  <Text fontSize="16px" color="text1" lineHeight="40px">
                    {t('earn.unclaimedReward', { symbol: 'PNG' })}
                  </Text>
                </Box>
              )}

              {isSuperFarm &&
                rewardTokensAmount?.map((rewardAmount, i) => (
                  <Box textAlign="center" key={i}>
                    <Text fontSize="26px" fontWeight={500} marginRight={10} color="text1">
                      {<FormattedCurrencyAmount currencyAmount={rewardAmount} />}
                    </Text>
                    <Text fontSize="16px" color="text1" lineHeight="40px">
                      {t('earn.unclaimedReward', { symbol: rewardAmount?.token?.symbol })}
                    </Text>
                  </Box>
                ))}

              <Text fontSize="14px" color="text2">
                {t('earn.whenYouWithdrawWarning')}
              </Text>
            </Box>
          </Header>
          <Footer>
            <Box my={'10px'}>
              <Button variant="primary" onClick={onWithdraw}>
                {error ?? t('earn.withdrawAndClaim')}
              </Button>
            </Box>
          </Footer>
        </Root>
      )}

      {attempting && !hash && (
        <PendingWrapper>
          <Box mb={'15px'}>
            <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
          </Box>
          <Text fontWeight={500} fontSize={20} color="text1" textAlign="center">
            {t('earn.withdraw')}
          </Text>
          <Text fontWeight={600} fontSize={14} color="text1" textAlign="center">
            {t('earn.withdrawingLiquidity', {
              amount: stakingInfo?.stakedAmount?.toSignificant(4),
              symbol: 'PGL'
            })}
          </Text>

          <Text fontWeight={600} fontSize={14} color="text1" textAlign="center">
            {t('earn.claimingReward', {
              amount: stakingInfo?.earnedAmount?.toSignificant(4),
              symbol: 'PNG'
            })}
          </Text>
        </PendingWrapper>
      )}
      {hash && (
        <SubmittedWrapper>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" paddingY={'20px'}>
            <Box flex="1" display="flex" alignItems="center">
              <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary} />
            </Box>
            <Text fontWeight={500} fontSize={20} color="text1">
              {t('earn.transactionSubmitted')}
            </Text>

            <Text fontSize={20} color="text1">
              {t('earn.withdrewStakingToken', { symbol: 'PGL' })}
            </Text>

            <Text fontSize={20} color="text1">
              {t('earn.claimedReward', { symbol: 'PNG' })}
            </Text>

            {chainId && hash && (
              <Link
                as="a"
                fontWeight={500}
                fontSize={14}
                color={'primary'}
                href={getEtherscanLink(chainId, hash, 'transaction')}
              >
                {t('transactionConfirmation.viewExplorer')}
              </Link>
            )}
          </Box>
          <Button variant="primary" onClick={() => onClose()}>
            {t('transactionConfirmation.close')}
          </Button>
        </SubmittedWrapper>
      )}
    </PageWrapper>
  )
}
export default Withdraw
