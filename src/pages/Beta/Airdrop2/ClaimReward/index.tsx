import React, { useCallback, useEffect, useState } from 'react'
import { Wrapper } from '../styleds'
import { Text, Button, Box } from '@pangolindex/components'
import { Chain, TokenAmount } from '@pangolindex/sdk'
import { useClaimAirdrop, useMerkledropClaimedAmounts, useMerkledropProof } from 'src/state/airdrop/hooks'
import { useWeb3React } from '@web3-react/core'
import { PNG } from 'src/constants/tokens'
import { useChainId } from 'src/hooks'
import ConfirmDrawer from './ConfirmDrawer'
import NotEligible from './NotEligible'
import AlreadyClaimed from './Claimed'
import Title from '../Title'

interface Props {
  chain: Chain
}

const ClaimReward: React.FC<Props> = ({ chain }) => {
  const { account } = useWeb3React()
  const chainId = useChainId()

  const png = PNG[chainId]

  const [openDrawer, setOpenDrawer] = useState(false)

  const { onClaim, onDimiss, hash, attempting, error } = useClaimAirdrop(account)

  const { data } = useMerkledropProof(account)
  const claimedAmount = useMerkledropClaimedAmounts(account)

  const claimAmount = data?.amount ?? new TokenAmount(PNG[chainId], '0')
  const totalToClaim = claimAmount.subtract(claimedAmount)

  const handleConfirmDismiss = useCallback(() => {
    onDimiss()
    setOpenDrawer(false)
  }, [onDimiss])

  useEffect(() => {
    if (openDrawer && !attempting && !hash && !error) {
      handleConfirmDismiss()
    }
    if (!openDrawer && attempting) {
      setOpenDrawer(true)
    }
  }, [handleConfirmDismiss, attempting, error, hash, openDrawer])

  if (claimAmount.lessThan('0') || claimAmount.equalTo('0')) {
    return <NotEligible chain={chain} />
  }

  if (totalToClaim.lessThan('0') || totalToClaim.equalTo('0')) {
    return <AlreadyClaimed chain={chain} />
  }

  return (
    <Wrapper>
      <Title chain={chain} title="You Are Eligible!" />
      <Box display="flex" alignItems="center" minHeight="150px">
        <Text fontSize={16} fontWeight={500} color="text10">
          You are eligible for:
        </Text>
        <Text fontSize={[22, 18]} fontWeight={700} color="primary" ml="10px">
          {totalToClaim.lessThan('0') ? '0.00' : totalToClaim.toFixed(2)} {png.symbol}
        </Text>
      </Box>
      <Button variant="primary" color="black" height="46px" onClick={onClaim}>
        CLAIM
      </Button>
      <ConfirmDrawer
        isOpen={openDrawer}
        onClose={handleConfirmDismiss}
        attemptingTxn={attempting}
        txHash={hash}
        errorMessage={error}
        chain={chain}
      />
    </Wrapper>
  )
}

export default ClaimReward
