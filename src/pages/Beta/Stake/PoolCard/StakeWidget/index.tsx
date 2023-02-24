import React from 'react'
import { MENU_LINK } from 'src/constants'
import { Root, Buttons, MaxButton, StakeWrapper, GridContainer, InputText } from './styled'
import {
  Box,
  Button,
  NumberOptions,
  useTranslation,
  Loader,
  Stat,
  TransactionCompleted,
  useWalletModalToggle,
  ZERO_ADDRESS,
  TransactionApprovalState as ApprovalState
} from '@pangolindex/components'
import { SingleSideStakingInfo, useDerivedStakingProcess } from 'src/state/stake/hooks'
import { useActiveWeb3React } from 'src/hooks'

type Props = {
  stakingInfo: SingleSideStakingInfo
  onClose?: () => void
}

const StakeWidget: React.FC<Props> = ({ stakingInfo, onClose }) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()

  const toggleWalletModal = useWalletModalToggle()

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
    png,
    onUserInput,
    onAttemptToApprove,
    wrappedOnDismiss,
    handleMax,
    onStake,
    onChangePercentage,
    setStepIndex
  } = useDerivedStakingProcess(stakingInfo)

  const isDisabled = !userPngUnstaked?.greaterThan('0')

  return (
    <Root>
      {!attempting && !hash && (
        <>
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <InputText
                value={parsedAmount?.toExact() || '0'}
                addonAfter={
                  <Box display={'flex'} alignItems={'center'} height={'100%'} justifyContent={'center'}>
                    <MaxButton onClick={() => handleMax()}>PNG</MaxButton>
                  </Box>
                }
                onChange={(value: any) => {
                  onUserInput(value)
                }}
                label={`Enter PNG`}
                fontSize={24}
                isNumeric={true}
                placeholder="0.00"
                disabled={isDisabled}
              />

              <Box ml="5px" mt="25px">
                <NumberOptions
                  onChange={value => {
                    setStepIndex(value / 25)
                    onChangePercentage(value)
                  }}
                  currentValue={stepIndex * 25}
                  variant="box"
                  isDisabled={isDisabled}
                  isPercentage={true}
                />
              </Box>
            </Box>

            <StakeWrapper>
              <GridContainer>
                <Box>
                  <Stat
                    title={`${t('migratePage.dollarWorth')}`}
                    stat={`${dollerWorth ? `$${dollerWorth?.toFixed(4)}` : '-'}`}
                    titlePosition="top"
                    titleFontSize={[14, 12]}
                    statFontSize={[18, 14]}
                    titleColor="text2"
                  />
                </Box>

                <Box>
                  <Stat
                    title={`${t('earn.weeklyRewards')}`}
                    stat={hypotheticalRewardRatePerWeek ? `${hypotheticalRewardRatePerWeek.toSignificant(4)}` : '-'}
                    titlePosition="top"
                    titleFontSize={[14, 12]}
                    statFontSize={[18, 14]}
                    titleColor="text2"
                    currency={stakingInfo?.rewardToken}
                  />
                </Box>
              </GridContainer>
            </StakeWrapper>
          </Box>

          <Buttons isStaked={userPngUnstaked?.greaterThan('0')}>
            {/* show staked or get png button */}

            {!account ? (
              <Button variant="primary" onClick={toggleWalletModal}>
                {t('web3Status.connectToWallet')}
              </Button>
            ) : userPngUnstaked?.greaterThan('0') ? (
              <>
                <Button
                  variant={approval === ApprovalState.APPROVED || signatureData !== null ? 'confirm' : 'primary'}
                  isDisabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
                  onClick={onAttemptToApprove}
                  height="46px"
                >
                  {t('earn.approve')}
                </Button>
                <Button
                  variant={'primary'}
                  isDisabled={!!error || (signatureData === null && approval !== ApprovalState.APPROVED)}
                  onClick={onStake}
                  height="46px"
                >
                  {error ?? t('earnPage.stake')}
                </Button>
              </>
            ) : (
              <Button
                padding="15px 18px"
                variant="primary"
                as="a"
                href={`/#${MENU_LINK.swap}?inputCurrency=${ZERO_ADDRESS}&outputCurrency=${png.address}`}
              >
                {t('header.buy', { symbol: stakeToken })}
              </Button>
            )}
          </Buttons>
        </>
      )}
      {attempting && !hash && <Loader size={100} label={'Staking'} />}
      {hash && (
        <TransactionCompleted
          onClose={() => {
            wrappedOnDismiss()
            onClose && onClose()
          }}
          submitText={'Staked'}
        />
      )}
    </Root>
  )
}

export default StakeWidget
