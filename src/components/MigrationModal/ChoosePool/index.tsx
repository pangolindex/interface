import React from 'react'
import { Wrapper } from './styleds'
import { Text, Checkbox, Box, Button } from '@pangolindex/components'
import { Pair } from '@pangolindex/sdk'
import PairData from './PairData'
import { StakingInfo } from '../../../state/stake/hooks'
import { useTranslation } from 'react-i18next'

export interface ChoosePoolProps {
  allChoosePool: { [address: string]: { pair: Pair; staking: StakingInfo } }
  allPool: { [address: string]: { pair: Pair; staking: StakingInfo } }
  v2IsLoading: boolean
  toggleSelectAll: (value: boolean) => void
  toggleIndividualSelect: (address: string) => void
  goNext: () => void
}

const ChoosePool = ({
  allChoosePool,
  allPool,
  v2IsLoading,
  toggleSelectAll,
  toggleIndividualSelect,
  goNext
}: ChoosePoolProps) => {
  const { t } = useTranslation()
  return (
    <Wrapper>
      <Text color="text4" fontSize={16}>
        {t('migratePage.migrationModalDescription')}
      </Text>
      <Box p={10}>
        <Checkbox
          label={t('migratePage.selectAll')}
          onChange={check => {
            toggleSelectAll(check)
          }}
          checked={(Object.keys(allPool) || []).length === (Object.keys(allChoosePool) || []).length}
        />
      </Box>

      <Box maxHeight="200px" overflowY="auto">
        {(Object.keys(allPool) || []).map(address => {
          return (
            <PairData
              key={address}
              pair={allPool[address]?.pair}
              stakingData={allPool[address]?.staking}
              selected={!!allChoosePool[address]}
              address={address}
              toggleIndividualSelect={toggleIndividualSelect}
            />
          )
        })}
      </Box>
      <Box mt={30}>
        <Button
          variant="primary"
          onClick={() => {
            if ((Object.keys(allChoosePool) || []).length > 0) {
              goNext()
            }
          }}
          isDisabled={v2IsLoading || (Object.keys(allChoosePool) || []).length === 0}
        >
          {t('migratePage.choosePool')}
        </Button>
      </Box>
    </Wrapper>
  )
}
export default ChoosePool
