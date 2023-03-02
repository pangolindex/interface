import React, { useCallback, useEffect, useState } from 'react'
import { Wrapper } from '../styleds'
import { Text, Button, Box, Loader, Tooltip } from '@pangolindex/components'
import { Chain, TokenAmount } from '@pangolindex/sdk'
import { useClaimAirdrop, useMerkledropClaimedAmounts, useMerkledropProof } from 'src/state/airdrop/hooks'
import { PNG } from 'src/constants/tokens'
import { useChainId } from 'src/hooks'
import ConfirmDrawer from './ConfirmDrawer'
import NotEligible from './NotEligible'
import AlreadyClaimed from './Claimed'
import Title from '../Title'
import { AirdropData } from 'src/constants/airdrop'
import { formatUnits } from 'ethers/lib/utils'

interface Props extends AirdropData {
  chain: Chain
}

const ClaimReward: React.FC<Props> = ({ address, type, chain, title }) => {
  const chainId = useChainId()

  const png = PNG[chainId]

  const [openDrawer, setOpenDrawer] = useState(false)

  const { onClaim, onDimiss, hash, attempting, error } = useClaimAirdrop(address, type)

  const { data, isLoading: isLoadingProof } = useMerkledropProof(address)
  const { data: _claimedAmount, isLoading } = useMerkledropClaimedAmounts(address)

  const claimedAmount = _claimedAmount ?? new TokenAmount(png, '0')

  const claimAmount = data?.amount ?? new TokenAmount(png, '0')
  const totalToClaim = claimAmount.equalTo('0') ? new TokenAmount(png, '0') : claimAmount.subtract(claimedAmount)

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

  if (isLoading || isLoadingProof) {
    return (
      <Wrapper>
        <Loader size={40} />
      </Wrapper>
    )
  }

  if (claimAmount.lessThan('0') || claimAmount.equalTo('0')) {
    return <NotEligible chain={chain} subtitle={title} />
  }

  if ((totalToClaim.lessThan('0') || totalToClaim.equalTo('0')) && !hash && !attempting && !error) {
    return <AlreadyClaimed chain={chain} subtitle={title} />
  }

  return (
    <Wrapper>
      <Title chain={chain} title="You Are Eligible!" subtitle={title} />
      <Box display="flex" alignItems="center" minHeight="150px">
        <Text fontSize={16} fontWeight={500} color="text10">
          You are eligible for:
        </Text>
        <Tooltip id="airdrop-amount">
          <Text fontSize={[22, 18]} fontWeight={700} color="primary" ml="10px">
            {formatUnits(totalToClaim.raw.toString(), png.decimals)} {png.symbol}
          </Text>
        </Tooltip>
        <Text fontSize={[22, 18]} fontWeight={700} color="primary" ml="10px" data-tip data-for="airdrop-amount">
          {totalToClaim.toFixed(2)} {png.symbol}
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
        airdropType={type}
      />
    </Wrapper>
  )
}

export default ClaimReward
