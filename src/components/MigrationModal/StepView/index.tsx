import React, { useState, useEffect, useContext } from 'react'
import { Wrapper, ConfirmedIcon, Section } from './styleds'
import { Text, Steps, Step, Box } from '@antiyro/components'
import { CloseIcon } from '../../../theme/components'
import { useTranslation } from 'react-i18next'
import ChoosePool from '../ChoosePool'
import Unstake from '../Unstake'
import Stake from '../Stake'
import { Pair } from '@antiyro/sdk'
import { useGetMigrationData } from '../../../state/migrate/hooks'
import { StakingInfo } from '../../../state/stake/hooks'
import { AutoColumn } from '../../Column'
import { RowBetween } from '../../Row'
import { useBlockNumber } from '../../../state/application/hooks'
import { ArrowUpCircle } from 'react-feather'
import { ThemeContext } from 'styled-components'
import Loader from '../Loader'

export interface StepProps {
  selectedPool?: { [address: string]: { pair: Pair; staking: StakingInfo } }
  version: number
  onDismiss?: () => void
}

const StepView = ({ selectedPool, version, onDismiss }: StepProps) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const [currentStep, setCurrentStep] = useState(0)
  const [allChoosePool, setAllChoosePool] = useState({} as { [address: string]: { pair: Pair; staking: StakingInfo } })

  const { allPool, v2IsLoading } = useGetMigrationData(version)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [choosePoolIndex, setChoosePoolIndex] = useState(0)

  const [isUnstakeComplete, setIsUnstakeComplete] = useState(false)
  const [isStakingLoading, setIsStakingLoading] = useState(false)

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
      const newAllChoosePool = allChoosePool
      delete newAllChoosePool[address]
      setAllChoosePool({ ...newAllChoosePool })
    } else {
      const newObject = allPool[address]
      const container = {} as { [address: string]: { pair: Pair; staking: StakingInfo } }
      container[address] = newObject
      setAllChoosePool({ ...allChoosePool, ...container })
    }
  }

  const goNext = () => {
    const newStep = currentStep + 1
    setCurrentStep(newStep)
  }

  const goBack = () => {
    const newStep = currentStep - 1
    setCurrentStep(newStep)
  }

  const allChoosePoolLength = (Object.keys(allChoosePool) || []).length

  const latestBlockNumber = useBlockNumber()

  useEffect(() => {
    if (latestBlockNumber && loading) {
      setLoading(false)
      setCompleted(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestBlockNumber])

  useEffect(() => {
    if (latestBlockNumber && isUnstakeComplete && !isStakingLoading) {
      setIsStakingLoading(true)
    } else if (latestBlockNumber && isUnstakeComplete && isStakingLoading) {
      setIsStakingLoading(false)
      setIsUnstakeComplete(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestBlockNumber, isUnstakeComplete])

  return (
    <Wrapper>
      {!loading && !completed ? (
        <>
          <RowBetween>
            <div />
            <CloseIcon onClick={() => onDismiss && onDismiss()} />
          </RowBetween>

          <Text color="text1" fontSize={32}>
            {currentStep > 0 && allChoosePoolLength > 1
              ? t('migratePage.migrateModalHeading', {
                  current: choosePoolIndex + 1,
                  total: allChoosePoolLength
                })
              : t('migratePage.migrate')}
          </Text>

          <Box mt={10}>
            <Steps onChange={handleChange} current={currentStep} allowChangeOnClick={false}>
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
                goNext={() => {
                  setIsUnstakeComplete(true)
                  goNext()
                }}
                goBack={goBack}
                choosePoolIndex={choosePoolIndex}
              />
            )}

            {currentStep === 2 && (
              <Stake
                allChoosePool={allChoosePool}
                setCompleted={() => {
                  setLoading(true)
                  // setCompleted(true)
                }}
                allChoosePoolLength={allChoosePoolLength}
                goBack={goBack}
                choosePoolIndex={choosePoolIndex}
                setChoosePoolIndex={value => setChoosePoolIndex(value)}
                isStakingLoading={isStakingLoading}
              />
            )}
          </Box>
        </>
      ) : !loading && completed ? (
        <Wrapper>
          <Section>
            <ConfirmedIcon>
              <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary1} />
            </ConfirmedIcon>

            <AutoColumn gap="12px" justify={'center'}>
              <Text color="text4" fontSize={24}>
                {t('earn.transactionSubmitted')}
              </Text>
            </AutoColumn>
          </Section>
        </Wrapper>
      ) : (
        <Loader loadingText={t('migratePage.submittingTransaction')} />
      )}
    </Wrapper>
  )
}
export default StepView
