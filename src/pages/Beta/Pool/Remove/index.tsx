import React, { useState } from 'react'
import { Box, ToggleButtons, Text } from '@pangolindex/components'
import { RemoveWrapper } from './styleds'
import { StakingInfo } from 'src/state/stake/hooks'
import RemoveLiquidity from '../RemoveLiquidity'
import RemoveFarm from '../RemoveFarm'
import { useChainId } from 'src/hooks'
import { unwrappedToken } from 'src/utils/wrappedCurrency'
import { useDerivedBurnInfo } from 'src/state/burn/hooks'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  const token0 = stakingInfo.tokens[0]
  const token1 = stakingInfo.tokens[1]

  const currencyA = unwrappedToken(token0, chainId)
  const currencyB = unwrappedToken(token1, chainId)

  const { userLiquidity } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)

  const renderRemoveContent = () => {
    if (!!userLiquidity && Number(userLiquidity?.toSignificant()) > 0) {
      return <RemoveLiquidity currencyA={currencyA} currencyB={currencyB} />
    } else {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Text color="text2" fontSize={16} fontWeight={500} textAlign="center">
            {t('pool.noLiquidity')}
          </Text>
        </Box>
      )
    }
  }

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
        <RemoveFarm stakingInfo={stakingInfo} onClose={onClose} version={version} />
      ) : (
        renderRemoveContent()
      )}
    </RemoveWrapper>
  )
}
export default Remove
