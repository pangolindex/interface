import React, {useContext, useState, useEffect, useCallback} from 'react'
import styled, {ThemeContext} from 'styled-components'
import {useActiveWeb3React} from '../../hooks'
import {useChainbridge} from '../../contexts/chainbridge/ChainbridgeContext'
import {ButtonDropdownLight, ButtonLight, ButtonPink} from '../Button'
import {AutoColumn} from '../Column'
import Row from '../Row'
import {Icon} from './DropdownSelector'
import {NETWORK_LABELS} from '../../constants'
import {TYPE} from '../../theme'
import {Text} from 'rebass'
import {useWalletModalToggle} from '../../state/application/hooks'
import AvaxLogo from '../../assets/images/avalanche_token_round.png'
import EthLogo from '../../assets/images/ethereum-logo.png'
import TokenSelectInput from './TokenSelectInput'
import {BigNumber, utils} from 'ethers'
import {parseUnits} from 'ethers/lib/utils'
import {TokenConfig} from '../../contexts/chainbridge/chainbridgeConfig'
import {useETHBalances} from '../../state/wallet/hooks'
import Modal from '../Modal'
import WrapperConfirmationModal from './Modals/WrapperConfirmationModal'
import WrapperActiveModal from './Modals/WrapperActiveModal'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const ContainerRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0px;
  flex-direction: row;
  background-color: ${({theme}) => theme.bg1};
`

const CROSSCHAIN_LOGOS: { [key: number]: string } = {
  1: EthLogo,
  2: AvaxLogo
}

type TransferDetails = {
  tokenAmount: number
}

export default function TokenWrappingPanel() {

  const {chainId, account} = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const theme = useContext(ThemeContext)
  const {
    homeChain,
    wrapTokenConfig,
    wrapToken,
    unwrapToken,
    destinationChain,
    tokenBalance,
    gasPrice
  } = useChainbridge()
  const ethBalance = useETHBalances(account ? [account] : [])
  const [preflightModalOpen, setPreflightModalOpen] = useState<boolean>(false)
  const [transferDetails, setTransferDetails] = useState<TransferDetails>({
    tokenAmount: 0,
  })
  const [validInputValues, setValidInputValues] = useState<boolean>(false)
  const [selectedTokenBalance, setSelectedTokenBalance] = useState<number>(0)
  const [typedValue, setTypedValue] = useState('')
  const [action, setAction] = useState<'wrap' | 'unwrap' | 'none'>('none')

  const DECIMALS = 18

  const onUserInput = useCallback((typedValue: string) => {
    setTypedValue(typedValue)
    setTransferDetails({
      ...transferDetails,
      tokenAmount: Number(typedValue),
    })
  }, [transferDetails])

  const onMax = useCallback(() => {
    onUserInput(selectedTokenBalance.toString())
  }, [selectedTokenBalance, onUserInput])

  const [txDetails, setTxDetails] = useState<| {
    transactionStatus?: 'inProgress' | 'done' | 'error'
    value: number
    tokenInfo: TokenConfig
    txHash?: string
    action: 'wrap' | 'unwrap' | 'none'
  }
    | undefined>(undefined)

  const handleWrapToken = async () => {
    if (!wrapTokenConfig || !wrapToken || !homeChain) return

    try {
      setTxDetails({
        tokenInfo: wrapTokenConfig,
        value: transferDetails.tokenAmount,
        transactionStatus: 'inProgress',
        action: action,
      })

      const tx = await wrapToken({
        value: parseUnits(`${transferDetails.tokenAmount}`, DECIMALS),
        gasPrice: BigNumber.from(
          utils.parseUnits(
            (homeChain.defaultGasPrice || gasPrice).toString(),
            9
          )
        ).toString(),
      })

      await tx?.wait()
      setTxDetails({
        tokenInfo: wrapTokenConfig,
        value: transferDetails.tokenAmount,
        txHash: tx?.hash,
        transactionStatus: 'done',
        action: action,
      })
    } catch (error) {
      console.error(error)
      setTxDetails({
        tokenInfo: wrapTokenConfig,
        value: transferDetails.tokenAmount,
        txHash: undefined,
        transactionStatus: 'error',
        action: action,
      })
    }
  }

  const handleUnwrapToken = async () => {
    if (!wrapTokenConfig || !unwrapToken || !homeChain) return

    try {
      setTxDetails({
        tokenInfo: wrapTokenConfig,
        value: transferDetails.tokenAmount,
        transactionStatus: 'inProgress',
        action: action,
      })
      const tx = await unwrapToken(
        parseUnits(`${transferDetails.tokenAmount}`, DECIMALS),
        {
          gasPrice: utils
            .parseUnits((homeChain.defaultGasPrice || gasPrice).toString(), 9)
            .toString(),
        }
      )

      await tx?.wait()
      setTxDetails({
        tokenInfo: wrapTokenConfig,
        value: transferDetails.tokenAmount,
        txHash: tx?.hash,
        transactionStatus: 'done',
        action: action,
      })
    } catch (error) {
      console.error(error)
      setTxDetails({
        tokenInfo: wrapTokenConfig,
        value: transferDetails.tokenAmount,
        txHash: undefined,
        transactionStatus: 'error',
        action: action,
      })
    }
  }

  const options = [
    homeChain?.chainId === 1
      ? {
        imageUri:
          'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15/logo.png',
        symbol: 'Ethereum',
        label: 'Ethereum',
        value: 'wrap',
      }
      : {
        imageUri:
          'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/ethereum-tokens/0x9dEbca6eA3af87Bf422Cea9ac955618ceb56EfB4/logo.png',
        symbol: 'AVAX',
        label: 'AVAX',
        value: 'wrap',
      },
    {
      imageUri: wrapTokenConfig?.imageUri,
      symbol: wrapTokenConfig?.symbol || 'wETH',
      label: wrapTokenConfig?.symbol || 'wETH',
      value: 'unwrap',
    },
  ]

  const tokensForSelector = {
    [options[0].value]: {
      ...options[0],
    },
    [options[1].value]: {
      ...options[1],
    },
  }

  const updateSelectedTokenBalance = useCallback(async () => {
    if (action === 'wrap' && account) {
      const rawBalance = ethBalance[account]?.raw
      if (rawBalance) {
        setSelectedTokenBalance(Number(utils.formatUnits(rawBalance.toString(), DECIMALS)))
      }
    } else if (wrapTokenConfig && account) {
      const currentBalance = Number(
        await tokenBalance(
          wrapTokenConfig.address
        )
      )
      setSelectedTokenBalance(currentBalance)
    }
  }, [ethBalance, wrapTokenConfig, action, account, tokenBalance])

  useEffect(() => {
    updateSelectedTokenBalance()
  }, [updateSelectedTokenBalance])


  useEffect(() => {
    if (!(transferDetails && account && homeChain &&
      transferDetails.tokenAmount > 0 && action !== 'none' &&
      selectedTokenBalance >= transferDetails.tokenAmount
    )
    ) {
      setValidInputValues(false)
    } else {
      setValidInputValues(true)
    }
  }, [transferDetails, account, homeChain, selectedTokenBalance, action])


  return (
    <>
      {(!account) ? (
        <Container>
          <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
        </Container>
      ) : (
        <>
          <Container>
            <ContainerRow>
              <AutoColumn style={{width: '100%', textAlign: 'center'}}>
                <ButtonDropdownLight disabled={true}>
                  {chainId ? (
                    <Row>
                      <Icon src={CROSSCHAIN_LOGOS[chainId]}/>
                      <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                        {NETWORK_LABELS[chainId]}
                      </Text>
                    </Row>
                  ) : (
                    <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                      Connect to a network
                    </Text>
                  )}
                </ButtonDropdownLight>

                <TYPE.black color={theme.text4} fontWeight={500} fontSize={14} paddingTop={2} paddingBottom={3}>
                  Home network
                </TYPE.black>
              </AutoColumn>
            </ContainerRow>
            <ContainerRow>
              <AutoColumn style={{width: '100%', textAlign: 'left'}}>
                <TokenSelectInput
                  tokens={tokensForSelector as any}
                  name='token'
                  value={options[0]}
                  disabled={!destinationChain}
                  label={`Balance: `}
                  amount={typedValue}
                  onUserInput={onUserInput}
                  onMax={onMax}
                  maxDisabled={!(selectedTokenBalance > 0)}
                  sync={(action) => setAction(action as any)}
                  options={
                    options.map((t) => ({
                      value: t.value,
                      icon: t.imageUri,
                      alt: t.symbol,
                      label: t.symbol || 'Unknown',
                    })) || []
                  }
                />
                <TYPE.black color={theme.text4} fontWeight={500} fontSize={14} padding={3}>
                  Balance: {selectedTokenBalance}
                </TYPE.black>
              </AutoColumn>
            </ContainerRow>
            <ContainerRow>

              <AutoColumn style={{width: '100%', textAlign: 'left'}}>

                <ButtonPink disabled={!validInputValues} onClick={() => {
                  setPreflightModalOpen(true)
                }}>{action === 'wrap' ? 'Wrap Token' : 'Unwrap token'}</ButtonPink>
              </AutoColumn>
            </ContainerRow>
          </Container>
            <Modal isOpen={!!txDetails} onDismiss={() => {
              setTxDetails(undefined)
            }}>
              {txDetails && (<WrapperActiveModal
              {...txDetails}
              close={() => {
                setTxDetails(undefined)
              }}
            />)}
          </Modal>

          <Modal isOpen={preflightModalOpen} onDismiss={() => setPreflightModalOpen(false)}>
            <WrapperConfirmationModal
              open={preflightModalOpen}
              close={() => setPreflightModalOpen(false)}
              sender={account || ''}
              start={() => {
                if (action === 'wrap') {
                  handleWrapToken()
                  setPreflightModalOpen(false)
                } else {
                  handleUnwrapToken()
                  setPreflightModalOpen(false)
                }
              }}
              sourceNetwork={homeChain?.name || ''}
              tokenSymbol={
                action === 'wrap'
                  ? homeChain?.nativeTokenSymbol || 'ETH'
                  : wrapTokenConfig?.symbol || 'wETH'
              }
              value={transferDetails?.tokenAmount || 0}
              wrappedTitle={
                action === 'wrap'
                  ? `${wrapTokenConfig?.name} (${wrapTokenConfig?.symbol})`
                  : homeChain?.nativeTokenSymbol || 'ETH'
              }
              action={action}
            />
          </Modal>
        </>
      )}
    </>)
}