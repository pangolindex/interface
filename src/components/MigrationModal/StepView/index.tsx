import React, { useState, useEffect, useContext } from 'react'
import { Wrapper, ConfirmedIcon } from './styleds'
import { Text, Steps, Step, Box } from '@pangolindex/components'
import { useTranslation } from 'react-i18next'
import ChoosePool from '../ChoosePool'
import Unstake from '../Unstake'
import Stake from '../Stake'
import { Pair } from '@pangolindex/sdk'
import { useGetMigrationData } from '../../../state/migrate/hooks'
import { StakingInfo } from '../../../state/stake/hooks'
import { ArrowUpCircle } from 'react-feather'
import { AutoColumn } from '../../Column'
import { ThemeContext } from 'styled-components'

export interface StepProps {
  selectedPool?: { [address: string]: { pair: Pair; staking: StakingInfo } }
  version: number
}

const StepView = ({ selectedPool, version }: StepProps) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const [currentStep, setCurrentStep] = useState(0)
  const [allChoosePool, setAllChoosePool] = useState({} as { [address: string]: { pair: Pair; staking: StakingInfo } })

  const { allPool, v2IsLoading } = useGetMigrationData(version)
  const [completed, setCompleted] = useState(false)
  const handleChange = (step: number) => {
    setCurrentStep(step)
  }

  useEffect(() => {
    if (selectedPool) {
      setCurrentStep(1)

      setAllChoosePool(selectedPool)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPool])

  const toggleSelectAll = (check: boolean) => {
    if (check) {
      setAllChoosePool({ ...allPool })
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
      let newObject = allPool[address]
      let container = {} as { [address: string]: { pair: Pair; staking: StakingInfo } }
      container[address] = newObject
      setAllChoosePool({ ...allChoosePool, ...container })
    }
  }

  const goNext = () => {
    let newStep = currentStep + 1

    setCurrentStep(newStep)
  }

  const goBack = () => {
    let newStep = currentStep - 1

    setCurrentStep(newStep)
  }

  return (
    <Wrapper>
      {!completed ? (
        <>
          <Text color="text1" fontSize={32}>
            {t('migratePage.migrate')}
          </Text>

          <Box mt={10}>
            <Steps onChange={handleChange} current={currentStep}>
              <Step title={t('migratePage.choose')} />
              <Step title={t('migratePage.unstake')} disabled={currentStep === 0} />
              <Step title={t('migratePage.stake')} disabled={currentStep <= 1} />
            </Steps>
            {currentStep === 0 && (
              <ChoosePool
                allChoosePool={allChoosePool}
                allPool={allPool}
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
                goBack={goBack}
              />
            )}

            {currentStep === 2 && (
              <Stake
                allChoosePool={allChoosePool}
                setCompleted={() => setCompleted(true)}
                allChoosePoolLength={(Object.keys(allChoosePool) || []).length}
              />
            )}
          </Box>
        </>
      ) : (
        <Box mt={10}>
          <ConfirmedIcon>
            <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary1} />
          </ConfirmedIcon>

          <AutoColumn gap="12px" justify={'center'}>
            <Text color="text4" fontSize={24}>
              {t('earn.transactionSubmitted')}
            </Text>
          </AutoColumn>
        </Box>
      )}
    </Wrapper>
  )
}
export default StepView
