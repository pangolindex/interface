import React, { useState, useEffect, useContext } from 'react'
import { Wrapper, ConfirmedIcon, Section } from './styleds'
import { Text, Steps, Step, Box } from '@pangolindex/components'
import { CloseIcon, CustomLightSpinner } from '../../../theme/components'
import { useTranslation } from 'react-i18next'
import ChoosePool from '../ChoosePool'
import Unstake from '../Unstake'
import Stake from '../Stake'
import { Pair } from '@pangolindex/sdk'
import { useGetMigrationData } from '../../../state/migrate/hooks'
import { StakingInfo } from '../../../state/stake/hooks'
import { AutoColumn } from '../../Column'
import { RowBetween } from '../../Row'
import Circle from '../../../assets/images/blue-loader.svg'
import { useBlockNumber } from '../../../state/application/hooks'
import { ArrowUpCircle } from 'react-feather'
import { ThemeContext } from 'styled-components'

export interface StepProps {
  selectedPool?: { [address: string]: { pair: Pair; staking: StakingInfo } }
  version: number
  onDismiss: () => void
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

  const allChoosePoolLength = (Object.keys(allChoosePool) || []).length

  const latestBlockNumber = useBlockNumber()

  useEffect(() => {
    if (latestBlockNumber && loading) {
      setLoading(false)
      setCompleted(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestBlockNumber])

  return (
    <Wrapper>
      {!loading && !completed ? (
        <>
          <Text color="text1" fontSize={32}>
            {t('migratePage.migrate')} {allChoosePoolLength > 1 && `${choosePoolIndex + 1}/${allChoosePoolLength}`}
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
                goNext={goNext}
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
              />
            )}
          </Box>
        </>
      ) : !loading && completed ? (
        <Wrapper>
          <Section>
            <RowBetween>
              <div />
              <CloseIcon onClick={onDismiss} />
            </RowBetween>
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
        <Wrapper>
          <Section>
            <ConfirmedIcon>
              <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
            </ConfirmedIcon>
            <AutoColumn gap="12px" justify={'center'}>
              <Text fontWeight={500} fontSize={20}>
                {t('migratePage.submittingTransaction')}
              </Text>
            </AutoColumn>
          </Section>
        </Wrapper>
      )}
    </Wrapper>
  )
}
export default StepView
