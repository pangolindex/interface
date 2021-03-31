import React, {useCallback, useContext, useEffect, useState} from 'react'
import styled, {ThemeContext} from 'styled-components'
import {useActiveWeb3React} from '../../hooks'
import {AutoColumn} from '../Column'
import {TYPE} from '../../theme'
import Row from '../../components/Row'
import FeesReportWrapped from './Fees'
import {utils} from 'ethers'
import {ChevronsRight} from 'react-feather'
import {ButtonDropdownLight, ButtonEmpty, ButtonLight, ButtonPink} from '../../components/Button'
import {NETWORK_LABELS} from '../../constants'
import {Text} from 'rebass'
import {useChainbridge} from '../../contexts/chainbridge/ChainbridgeContext'
import TokenSelectInput from './TokenSelectInput'
import DropdownSelect, {Icon, OptionType} from './DropdownSelector'
import AvaxLogo from '../../assets/images/avalanche_token_round.png'
import EthLogo from '../../assets/images/ethereum-logo.png'
import {isAddress} from '../../utils'
import AddressInputPanel from '../AddressInputPanel'
import TransferConfirmationModal from './Modals/TransferConfirmationModal'
import Modal from '../Modal'
import TransferActiveModal from './Modals/TransferActiveModal'
import {useWalletModalToggle} from '../../state/application/hooks'

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


export default function BridgeTransferPanel() {
  const {chainId, account} = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const {
    homeChain,
    destinationChains,
    destinationChain,
    deposit,
    setDestinationChain,
    transactionStatus,
    resetDeposit,
    bridgeFee,
    networkFee,
    tokenBalance,
  } = useChainbridge()

  const theme = useContext(ThemeContext)
  const [currentNetworkFee, setCurrentNetworkFee] = useState<number>(0)
  const [typedValue, setTypedValue] = useState('')
  const [confirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false)
  const [validInputValues, setValidInputValues] = useState<boolean>(false)
  const [selectedTokenBalance, setSelectedTokenBalance] = useState<number>(0)


  const destChains = destinationChains.map((dc) => ({
    label: dc.name,
    value: dc.chainId,
  }))

  const destChain = destChains.find(
    (chain) => chain.value === destinationChain?.chainId
  )

  type TransferDetails = {
    tokenAmount: number
    token: string
    tokenSymbol: string
    receiver: string
  }

  const [transferDetails, setTransferDetails] = useState<TransferDetails>({
    receiver: '',
    token: '',
    tokenAmount: 0,
    tokenSymbol: '',
  })

  const CROSSCHAIN_LOGOS: { [key: number]: string } = {
    1: EthLogo,
    2: AvaxLogo,
    43113: AvaxLogo,
    43114: AvaxLogo
  }

  const onUserInput = useCallback((typedValue: string) => {
    setTypedValue(typedValue)
    setTransferDetails({
      ...transferDetails,
      tokenAmount: Number(typedValue),
    })
  }, [transferDetails])

  const handleAccountAddress = useCallback(() => {
    if (account) {
      setTransferDetails({
        ...transferDetails,
        receiver: account,
      })
    }
  }, [account, transferDetails])

  const onMax = useCallback(() => {
    onUserInput(selectedTokenBalance.toString())
  }, [selectedTokenBalance, onUserInput])

  const updateNetworkFee = async () => {
    if (!(account && chainId)) return
    const currentFee = Number(
      utils.formatUnits(
        await networkFee(
          transferDetails?.token,
          transferDetails?.tokenAmount
        ),
        18
      )
    )
    if (currentFee === 0) return
    setCurrentNetworkFee(currentFee)
  }

  useEffect(() => {
    if (!(transferDetails && account &&
      transferDetails.token && homeChain && destChain &&
      transferDetails.tokenAmount > 0 &&
      isAddress(transferDetails.receiver) &&
      selectedTokenBalance >= transferDetails.tokenAmount
    )
    ) {
      setValidInputValues(false)
    } else {
      setValidInputValues(true)
    }
  }, [transferDetails, account, homeChain, destChain, selectedTokenBalance])


  const updateSelectedTokenBalance = useCallback(async () => {
    if (transferDetails && account) {
      const currentBalance = Number(
        await tokenBalance(
          transferDetails?.token
        )
      )
      setSelectedTokenBalance(currentBalance)
    }
  }, [transferDetails, account, tokenBalance])

  useEffect(() => {
    const interval = setInterval(updateNetworkFee, 1000)
    return () => clearInterval(interval)
  })

  useEffect(() => {
    updateSelectedTokenBalance()
  }, [updateSelectedTokenBalance])

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
                  )}</ButtonDropdownLight>
                <TYPE.black color={theme.text4} fontWeight={500} fontSize={14} paddingTop={2} paddingBottom={3}>
                  Home network
                </TYPE.black>
              </AutoColumn>
              <AutoColumn>
                <p>
                  <ChevronsRight size='32' color='#888D9B'/>
                </p>
              </AutoColumn>
              <AutoColumn style={{width: '100%', textAlign: 'center'}}>

                <DropdownSelect
                  disabled={!destinationChain}
                  options={destChains.map((chain) => ({
                    value: chain.value,
                    label: chain.label,
                    icon: CROSSCHAIN_LOGOS[chain.value]
                  }))}
                  onChange={(option: OptionType) => {
                    setDestinationChain(option.value)
                    updateNetworkFee()
                  }}
                  value={destChain}
                />
                <TYPE.black color={theme.text4} fontWeight={500} fontSize={14} paddingTop={2} paddingBottom={3}>
                  Destination network
                </TYPE.black>
              </AutoColumn>

            </ContainerRow>
            <ContainerRow>
              <AutoColumn style={{width: '100%', textAlign: 'left'}}>
                <TokenSelectInput
                  tokens={homeChain?.tokens ? homeChain?.tokens : []}
                  name='token'
                  disabled={!destinationChain}
                  label={`Balance: `}
                  amount={typedValue}
                  onUserInput={onUserInput}
                  onMax={onMax}
                  maxDisabled={!(selectedTokenBalance > 0)}
                  sync={(tokenIndex) => {
                    let tokens = homeChain?.tokens
                    if (tokens && tokenIndex) {
                    setTransferDetails({
                        ...transferDetails,
                        token: tokens[tokenIndex].address,
                        tokenAmount: 0,
                        tokenSymbol: tokens[tokenIndex].symbol || 'Unknown',
                      })}
                    updateNetworkFee()
                  }}
                  options={
                    homeChain?.tokens.map((token, index) => ({
                      value: index,
                      icon: token.imageUri,
                      alt: token.name,
                      label: token.symbol || 'Unknown',
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
                <AddressInputPanel id='recipient' value={transferDetails.receiver}
                                   onChange={(e) => setTransferDetails({...transferDetails, receiver: e})}
                                   multipleExplorerLinks={true}/>
                <></>
                <ButtonEmpty onClick={handleAccountAddress}>Use my address</ButtonEmpty>
              </AutoColumn>
            </ContainerRow>
            <ContainerRow>
              <AutoColumn style={{width: '100%', textAlign: 'left'}}>
                <FeesReportWrapped fee={bridgeFee}
                                   feeSymbol={homeChain?.nativeTokenSymbol}
                                   networkFee={currentNetworkFee}
                                   networkFeeSymbol={homeChain?.nativeTokenSymbol}
                                   symbol={
                                     transferDetails && transferDetails.tokenSymbol
                                       ? transferDetails.tokenSymbol
                                       : undefined
                                   }
                                   amount={typedValue}/>
              </AutoColumn>
            </ContainerRow>
            <ContainerRow>

              <AutoColumn style={{width: '100%', textAlign: 'left'}}>

                <ButtonPink disabled={!validInputValues} onClick={() => {
                  updateNetworkFee()
                  setConfirmationModalOpen(true)
                }}>Start transfer</ButtonPink>
              </AutoColumn>
            </ContainerRow>
          </Container>
          <Modal isOpen={!!transactionStatus} onDismiss={() => resetDeposit()}>
            <TransferActiveModal open={!!transactionStatus} close={resetDeposit}/>
          </Modal>
          <Modal isOpen={confirmationModalOpen} onDismiss={() => setConfirmationModalOpen(false)}>
            <TransferConfirmationModal
              open={confirmationModalOpen}
              close={() => setConfirmationModalOpen(false)}
              receiver={transferDetails?.receiver || ''}
              sender={account || ''}
              start={() => {
                setConfirmationModalOpen(false)
                transferDetails &&
                deposit(
                  transferDetails.tokenAmount,
                  transferDetails.receiver,
                  transferDetails.token
                )
              }}
              sourceNetwork={homeChain?.name || ''}
              targetNetwork={destinationChain?.name || ''}
              tokenSymbol={transferDetails?.tokenSymbol || ''}
              value={transferDetails?.tokenAmount || 0}
              totalFee={(currentNetworkFee + (bridgeFee ? bridgeFee : 0))?.toFixed(5).toString() + ' ' + (homeChain?.nativeTokenSymbol || '') || ''}
            />
          </Modal>
        </>
      )}
    </>)
}