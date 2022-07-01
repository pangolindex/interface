import React, { useState } from 'react'
import { Box, ToggleButtons } from '@pangolindex/components'
import { RemoveWrapper } from './styleds'
import { StakingInfo } from 'src/state/stake/hooks'
import RemoveLiquidity from '../RemoveLiquidity'
import FarmRemove from '../FarmRemove'
import { useChainId } from 'src/hooks'
import { unwrappedToken } from 'src/utils/wrappedCurrency'

enum REMOVE_TYPE {
  FARM = 'Farm',
  LIQUIDITY = 'Liquidity'
}

interface WithdrawProps {
  stakingInfo: StakingInfo
  version: number
  onClose: () => void
}
const Remove = ({ stakingInfo, version, onClose }: WithdrawProps) => {
  const chainId = useChainId()
  const [removeType, setRemoveType] = useState(REMOVE_TYPE.FARM as string)

  const token0 = stakingInfo.tokens[0]
  const token1 = stakingInfo.tokens[1]

  const currencyA = unwrappedToken(token0, chainId)
  const currencyB = unwrappedToken(token1, chainId)

  return (
    <RemoveWrapper>
      <Box mt="5px" width="100%" mb="5px">
        <ToggleButtons
          options={[REMOVE_TYPE.FARM, REMOVE_TYPE.LIQUIDITY]}
          value={removeType}
          onChange={value => {
            setRemoveType(value)
          }}
        />
      </Box>
      {removeType === REMOVE_TYPE.FARM ? (
        <FarmRemove stakingInfo={stakingInfo} onClose={onClose} version={version} />
      ) : (
        <RemoveLiquidity currencyA={currencyA} currencyB={currencyB} />
      )}
    </RemoveWrapper>
  )
}
export default Remove
