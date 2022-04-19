import React from 'react'
import { ZERO_ADDRESS } from 'src/constants'
import { Root, Buttons, MaxButton, Balance, StakeWrapper, GridContainer } from './styled'
import { BETA_MENU_LINK } from 'src/constants'
import { Box, Button, Text, TextInput, CurrencyLogo } from '@pangolindex/components'
import { ApprovalState } from 'src/hooks/useApproveCallback'
import { SingleSideStakingInfo, useDerivedStakingProcess } from 'src/state/stake/hooks'
import { useTranslation } from 'react-i18next'
import TransactionCompleted from 'src/components/Beta/TransactionCompleted'
import Stat from 'src/components/Stat'
import Loader from 'src/components/Beta/Loader'
import { NumberOptions } from '@pangolindex/components'

type Props = {
  stakingInfo: SingleSideStakingInfo
  onClose?: () => void
  isRewardStake?: boolean
}

const StakeWidget: React.FC<Props> = ({ stakingInfo, onClose, isRewardStake }) => {
  const { t } = useTranslation()

  const {
    stakeToken,
    attempting,
    parsedAmount,
    hash,
    userPngUnstaked,
    stepIndex,
    dollerWorth,
    hypotheticalRewardRatePerWeek,
    signatureData,
    error,
    approval,
    account,
    png,
    onUserInput,
    onAttemptToApprove,
    wrappedOnDismiss,
    handleMax,
    onStake,
    setStepIndex,
    onChangePercentage
  } = useDerivedStakingProcess(stakingInfo)

  const isDisabled = !userPngUnstaked?.greaterThan('0')

  return (
    <Root>
      {!attempting && !hash && (
        <>
          {isRewardStake ? (
            <Box textAlign="center" mt={20} flex={1}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Text fontSize="26px" fontWeight={500} color="text1">
                  {parsedAmount?.toSignificant(6) || '0'}
                </Text>
                <Box ml={10} mt="8px">
                  <CurrencyLogo currency={png} size={24} imageSize={48} />
                </Box>
              </Box>

              <Text fontSize="14px" color="text2" textAlign="center" mt="15px" mb="15px">
                Stake your rewards
              </Text>
            </Box>
          ) : (
            <Box>
              <Box mb="5px">
                <Text color="color4" fontSize={20} fontWeight={500} mb="5px">
                  Stake
                </Text>

                {/* show already staked amount */}
                <Text color="color9" fontSize={14}>
                  Stake your PNG token to share platform fees
                </Text>
              </Box>
              <TextInput
                value={parsedAmount?.toExact() || '0'}
                addonAfter={
                  <Box display={'flex'} alignItems={'center'} height={'100%'} justifyContent={'center'}>
                    <MaxButton onClick={() => handleMax()}>PNG</MaxButton>
                  </Box>
                }
                onChange={(value: any) => {
                  onUserInput(value as any)
                }}
                label={`Enter PNG`}
                fontSize={24}
                isNumeric={true}
                placeholder="0.00"
                addonLabel={
                  account && (
                    <Balance>
                      {!!userPngUnstaked ? t('currencyInputPanel.balance') + userPngUnstaked?.toSignificant(6) : ' -'}
                    </Balance>
                  )
                }
                disabled={isDisabled}
              />

              <Box>
                <NumberOptions
                  onChange={value => {
                    setStepIndex(value)
                    onChangePercentage(value * 25)
                  }}
                  currentValue={stepIndex}
                  variant="step"
                  isDisabled={isDisabled}
                  isPercentage={true}
                />
              </Box>

              <StakeWrapper>
                <GridContainer>
                  <Box>
                    <Stat
                      title={`${t('migratePage.dollarWorth')}`}
                      stat={`${dollerWorth ? `$${dollerWorth?.toFixed(4)}` : '-'}`}
                      titlePosition="top"
                      titleFontSize={14}
                      statFontSize={18}
                      titleColor="text2"
                    />
                  </Box>

                  <Box>
                    <Stat
                      title={`${t('earn.weeklyRewards')}`}
                      stat={
                        hypotheticalRewardRatePerWeek
                          ? `${hypotheticalRewardRatePerWeek.toSignificant(4)}
      `
                          : '-'
                      }
                      titlePosition="top"
                      titleFontSize={14}
                      statFontSize={18}
                      titleColor="text2"
                      currency={stakingInfo?.rewardToken}
                    />
                  </Box>
                </GridContainer>
              </StakeWrapper>
            </Box>
          )}

          <Buttons isStaked={userPngUnstaked?.greaterThan('0')}>
            {/* show staked or get png button */}
            {userPngUnstaked?.greaterThan('0') ? (
              <>
                <Button
                  padding="15px 18px"
                  variant={approval === ApprovalState.APPROVED || signatureData !== null ? 'confirm' : 'primary'}
                  isDisabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
                  onClick={onAttemptToApprove}
                >
                  {t('earn.approve')}
                </Button>
                <Button
                  padding="15px 18px"
                  variant={'primary'}
                  isDisabled={!!error || (signatureData === null && approval !== ApprovalState.APPROVED)}
                  onClick={onStake}
                >
                  {error ?? t('earn.deposit')}
                </Button>
              </>
            ) : (
              <Button
                padding="15px 18px"
                variant="primary"
                as="a"
                href={`/#${BETA_MENU_LINK.swap}?inputCurrency=${ZERO_ADDRESS}&outputCurrency=${png.address}`}
              >
                {t('header.buy', { symbol: stakeToken })}
              </Button>
            )}
          </Buttons>
        </>
      )}
      {attempting && !hash && <Loader size={100} label={isRewardStake ? 'Reward Staking' : 'Staking'} />}
      {hash && (
        <TransactionCompleted
          onClose={() => {
            wrappedOnDismiss()
            onClose && onClose()
          }}
          submitText={isRewardStake ? 'Your rewards have been staked.' : 'Staked'}
          showCloseIcon={isRewardStake ? false : true}
        />
      )}
    </Root>
  )
}

export default StakeWidget
