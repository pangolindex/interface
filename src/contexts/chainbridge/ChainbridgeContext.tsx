import React, {useContext, useEffect, useReducer, useState} from 'react'
import {Bridge, BridgeFactory} from '@chainsafe/chainbridge-contracts'
import {BigNumber, BigNumberish, ContractTransaction, ethers, Overrides, PayableOverrides, utils,} from 'ethers'
import {Contract} from '@ethersproject/contracts'
import {BridgeConfig, chainbridgeConfig, TokenConfig,} from './chainbridgeConfig'
import {transitMessageReducer} from './reducers/TransitMessageReducer'
import {useActiveWeb3React} from '../../hooks'
import {ERC20_ABI} from '../../constants/abis/erc20'
import WETH_ABI from '../../constants/abis/weth.json'

interface IChainbridgeContextProps {
  children: React.ReactNode | React.ReactNode[]
}

export type Vote = {
  address: string
  signed: 'Confirmed' | 'Rejected'
}

const resetAllowanceLogicFor = [
  '0xdac17f958d2ee523a2206206994597c13d831ec7'.toLowerCase(), //USDT
  //Add other offending tokens here
]

type ChainbridgeContext = {
  homeChain?: BridgeConfig
  destinationChain?: BridgeConfig
  destinationChains: Array<{ chainId: number, name: string }>
  setDestinationChain(chainId: number): void
  deposit(
    amount: number,
    recipient: string,
    tokenAddress: string
  ): Promise<void>
  resetDeposit(): void
  transactionStatus?: TransactionStatus
  depositVotes: number
  relayerThreshold?: number
  depositNonce?: string
  inTransitMessages: Array<string | Vote>
  depositAmount?: number
  bridgeFee?: number
  gasPrice: number
  transferTxHash?: string
  selectedToken?: string
  wrapToken:
    | ((
    overrides?: PayableOverrides | undefined
  ) => Promise<ContractTransaction>)
    | undefined
  unwrapToken:
    | ((
    wad: BigNumberish,
    overrides?: Overrides | undefined
  ) => Promise<ContractTransaction>)
    | undefined
  wrapTokenConfig: TokenConfig | undefined
  transactionStatusReason: string | undefined
  networkFee(tokenAddress: string, amount: number): Promise<BigNumber>
  tokenBalance(tokenAddress: string): Promise<string>
}

type TransactionStatus =
  | 'Initializing Transfer'
  | 'In Transit'
  | 'Transfer Completed'
  | 'Transfer Aborted'

const ChainbridgeContext = React.createContext<ChainbridgeContext | undefined>(
  undefined
)

const ChainbridgeProvider = ({children}: IChainbridgeContextProps) => {
  const {account, library, chainId, active} = useActiveWeb3React()

  const [homeChain, setHomeChain] = useState<BridgeConfig | undefined>()
  const [relayerThreshold, setRelayerThreshold] = useState<number | undefined>(undefined)
  const [destinationChain, setDestinationChain] = useState<BridgeConfig | undefined>()
  const [destinationChains, setDestinationChains] = useState<BridgeConfig[]>([])
  // Contracts
  const [homeBridge, setHomeBridge] = useState<Bridge | undefined>(undefined)
  const [wrapper, setWrapper] = useState<Contract | undefined>(undefined)
  const [wrapTokenConfig, setWrapperConfig] = useState<TokenConfig | undefined>(undefined)
  const [destinationBridge, setDestinationBridge] = useState<Bridge | undefined>(undefined)
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus | undefined>(undefined)
  const [transactionStatusReason, setTransactionStatusReason] = useState<string | undefined>(undefined)
  const [depositNonce, setDepositNonce] = useState<string | undefined>(undefined)
  const [depositVotes, setDepositVotes] = useState<number>(0)
  const [inTransitMessages, tokensDispatch] = useReducer(transitMessageReducer, [])
  const [depositAmount, setDepositAmount] = useState<number | undefined>()
  const [bridgeFee, setBridgeFee] = useState<number | undefined>()
  const [gasPrice, setGasPrice] = useState<number>(0)
  const [transferTxHash, setTransferTxHash] = useState<string>('')
  const [selectedToken, setSelectedToken] = useState<string>('')

  const resetDeposit = () => {
    chainbridgeConfig.chains.length > 2 && setDestinationChain(undefined)
    setTransactionStatus(undefined)
    setDepositNonce(undefined)
    setDepositVotes(0)
    setDepositAmount(undefined)
    tokensDispatch({
      type: 'resetMessages',
    })
    setSelectedToken('')
  }

  const handleSetDestination = (chainId: number) => {
    const chain = destinationChains.find((c) => c.chainId === chainId)
    if (!chain) {
      throw new Error('Invalid destination chain selected')
    }
    setDestinationChain(chain)
  }

  useEffect(() => {
    if (destinationChain) {
      let library
      if (destinationChain?.rpcUrl.startsWith('wss')) {
        if (destinationChain.rpcUrl.includes('infura')) {
          const parts = destinationChain.rpcUrl.split('/')
          library = new ethers.providers.InfuraWebSocketProvider(
            destinationChain.networkId,
            parts[parts.length - 1]
          )
        }
        if (destinationChain.rpcUrl.includes('alchemyapi')) {
          const parts = destinationChain.rpcUrl.split('/')
          library = new ethers.providers.AlchemyWebSocketProvider(
            destinationChain.networkId,
            parts[parts.length - 1]
          )
        } else {
          library = new ethers.providers.WebSocketProvider(
            destinationChain.rpcUrl,
            destinationChain.networkId
          )
        }
      } else {
        library = new ethers.providers.JsonRpcProvider(
          destinationChain?.rpcUrl
        )
      }
      if (library) {
        const bridge = BridgeFactory.connect(
          destinationChain?.bridgeAddress,
          library
        )
        setDestinationBridge(bridge)
      }
    }
  }, [destinationChain])

  useEffect(() => {
    if (chainId && active) {
      const home = chainbridgeConfig.chains.find(
        (c) => c.networkId === chainId
      )
      if (!home) {
        setHomeChain(undefined)
        setHomeBridge(undefined)
        setWrapperConfig(undefined)
        setWrapper(undefined)
        return
      }
      setHomeChain(home)

      const signer = library?.getSigner()
      if (!signer) {
        console.log('No signer')
        return
      }

      const bridge = BridgeFactory.connect(home.bridgeAddress, signer)
      setHomeBridge(bridge)
      setDestinationChains(
        chainbridgeConfig.chains.filter((c) => c.networkId !== chainId)
      )
      if (chainbridgeConfig.chains.length === 2) {
        const destChain = chainbridgeConfig.chains.find(
          (c) => c.networkId !== chainId
        )

        destChain && setDestinationChain(destChain)
      }

      const wrapperToken = home.tokens.find(
        (token) => token.isNativeWrappedToken
      )

      if (!wrapperToken) {
        setWrapperConfig(undefined)
        setWrapper(undefined)
      } else {
        setWrapperConfig(wrapperToken)
        const connectedWeth = new Contract(wrapperToken.address, WETH_ABI, signer)
        setWrapper(connectedWeth)
      }
    } else {
      setHomeChain(undefined)
      setWrapperConfig(undefined)
      setWrapper(undefined)
    }
    resetDeposit()
  }, [active, chainId, library])

  useEffect(() => {
    const getGasPrice = async () => {
      const gasPriceSetting = 'fast'
      const etherChainUrl = 'https://www.etherchain.org/api/gasPriceOracle'
      try {
        let gasPrice
        const etherchainResponse = await (
          await fetch(etherChainUrl)
        ).json()
        gasPrice = Number(etherchainResponse[gasPriceSetting])
        gasPrice = !isNaN(Number(gasPrice)) ? Number(gasPrice) : 65
        setGasPrice(gasPrice)
      } catch (error) {
        console.log(error)
        console.log('Using 65 gwei as default')
        setGasPrice(65)
      }
    }
    getGasPrice()
  })

  useEffect(() => {
    const getRelayerThreshold = async () => {
      if (homeBridge) {
        const threshold = BigNumber.from(
          await homeBridge._relayerThreshold()
        ).toNumber()
        setRelayerThreshold(threshold)
      }
    }
    const getBridgeFee = async () => {
      if (homeBridge) {
        const bridgeFee = Number(utils.formatEther(await homeBridge._fee()))
        setBridgeFee(bridgeFee)
      }
    }
    getRelayerThreshold()
    getBridgeFee()
  }, [homeBridge])

  useEffect(() => {
    if (homeChain && destinationBridge && depositNonce) {
      destinationBridge.on(
        destinationBridge.filters.ProposalEvent(
          homeChain.chainId,
          BigNumber.from(depositNonce),
          null,
          null,
          null
        ),
        (originChainId, depositNonce, status, resourceId, dataHash, tx) => {
          switch (BigNumber.from(status).toNumber()) {
            case 1:
              tokensDispatch({
                type: 'addMessage',
                payload: `Proposal created on ${destinationChain?.name}`,
              })
              break
            case 2:
              tokensDispatch({
                type: 'addMessage',
                payload: `Proposal has passed. Executing...`,
              })
              break
            case 3:
              setTransactionStatus('Transfer Completed')
              setTransferTxHash(tx.transactionHash)
              setDepositNonce(undefined)
              break
            case 4:
              setTransactionStatus('Transfer Aborted')
              setTransferTxHash(tx.transactionHash)
              setDepositNonce(undefined)
              break
          }
        }
      )

      destinationBridge.on(
        destinationBridge.filters.ProposalVote(
          homeChain.chainId,
          BigNumber.from(depositNonce),
          null,
          null
        ),
        async (originChainId, depositNonce, status, resourceId, tx) => {
          const txReceipt = await tx.getTransactionReceipt()
          if (txReceipt.status === 1) {
            console.log('Setting deposit votes')
            setDepositVotes(depositVotes + 1)
          }
          tokensDispatch({
            type: 'addMessage',
            payload: {
              address: String(txReceipt.from),
              signed: txReceipt.status === 1 ? 'Confirmed' : 'Rejected',
            },
          })
        }
      )
    }
    return () => {
      //@ts-ignore
      destinationBridge?.removeAllListeners()
    }
  }, [
    depositNonce,
    homeChain,
    destinationBridge,
    depositVotes,
    destinationChain,
    inTransitMessages,
  ])

  const tokenBalance = async (tokenAddress: string) => {
    if (!homeChain) {
      console.log('tokenBalance: Home chain contract is not instantiated')
      return '0'
    }
    if (!library) {
      console.log('No provider')
      return '0'
    }
    const signer = library?.getSigner()
    if (!account || !signer) {
      console.log('NF: No signer')
      return '0'
    }
    try {
      const tokenContract = new Contract(tokenAddress, ERC20_ABI, signer)
      const balance = (await tokenContract.balanceOf(account))
      const decimals = (await tokenContract.decimals())
      return utils.formatUnits(balance, decimals)
    } catch
      (error) {
      console.log(
        'Got error while retrieving balance'
      )
      return '0'
    }
  }


  const networkFee = async (tokenAddress: string, amount: number) => {
    if (!homeChain) {
      console.log('networkFee: Home chain contract is not instantiated')
      return BigNumber.from('0')
    }
    if (!library) {
      console.log('No provider')
      return BigNumber.from('0')
    }

    const signer = library?.getSigner()
    if (!account || !signer) {
      console.log('NF: No signer')
      return BigNumber.from('0')
    }

    try {

      const tokenContract = new Contract(tokenAddress, ERC20_ABI, signer)
      const decimals = await tokenContract.decimals()

      const currentAllowance = await tokenContract.allowance(
        account,
        homeChain.erc20HandlerAddress
      )

      if (!gasPrice) {
        setGasPrice(65)
      }

      const estimatedDeposit = BigNumber.from('260000')
      const needsApproval =
        Number(utils.formatUnits(currentAllowance, decimals)) < amount
      const needsResetApproval =
        Number(utils.formatUnits(currentAllowance, decimals)) > 0 &&
        resetAllowanceLogicFor.includes(tokenAddress.toLowerCase())
      const currentGasPrice = BigNumber.from(
        utils.parseUnits((homeChain.defaultGasPrice || gasPrice).toString(), 9)
      )

      //Check if the user can afford the two transactions
      let price = estimatedDeposit.mul(currentGasPrice)
      if (needsApproval) {
        let estimatedApprove = BigNumber.from('47000')
        try {
          estimatedApprove = await tokenContract.estimateGas.approve(
            homeChain.erc20HandlerAddress,
            BigNumber.from(utils.parseUnits(amount.toString(), decimals))
          )
        } catch (e) {
          console.log(
            'Couldn\'t determine approval gas amount, falling back to 47000\n' +
            e
          )
          console.log(e)
        }
        price = price.add(estimatedApprove.mul(currentGasPrice))
        if (needsResetApproval) {
          price = price.add(estimatedApprove.mul(currentGasPrice))
        }
      }

      return price
    } catch (error) {
      console.log(
        'Got error while calculating price, using miniumum calculation'
      )
      console.log(error)

      const currentGasPrice = BigNumber.from(
        utils.parseUnits((homeChain.defaultGasPrice || gasPrice).toString(), 9)
      )
      const estimatedDeposit = BigNumber.from('260000')
      const estimatedApprove = BigNumber.from('47000')
      const needsResetApproval = resetAllowanceLogicFor.includes(
        tokenAddress.toLowerCase()
      )
      let price = estimatedDeposit.mul(currentGasPrice)
      price = price.add(estimatedApprove.mul(currentGasPrice))
      if (needsResetApproval) {
        price = price.add(estimatedApprove.mul(currentGasPrice))
      }

      return price
    }
  }

  const deposit = async (
    amount: number, // This is from Chainbridge, but wouldn't that be better as a string to avoid FP imprecision?
    recipient: string,
    tokenAddress: string
  ) => {
    if (!homeBridge || !homeChain) {
      console.log('Home bridge contract is not instantiated')
      return
    }
    if (!library) {
      console.log('No provider')
      return
    }

    if (!destinationChain || !destinationBridge) {
      console.log('Destination bridge contract is not instantiated')
      return
    }

    const signer = library?.getSigner()
    if (!account || !signer) {
      console.log('No signer')
      return
    }

    const token = homeChain.tokens.find(
      (token) => token.address === tokenAddress
    )

    if (!token) {
      console.log('Invalid token selected')
      return
    }

    setTransactionStatus('Initializing Transfer')
    setDepositAmount(amount)
    setSelectedToken(tokenAddress)
    const tokenContract = new Contract(tokenAddress, ERC20_ABI, signer)
    const decimals = await tokenContract.decimals()

    const data =
      '0x' +
      utils
        .hexZeroPad(
          // TODO Wire up dynamic token decimals
          BigNumber.from(
            utils.parseUnits(amount.toString(), decimals)
          ).toHexString(),
          32
        )
        .substr(2) + // Deposit Amount (32 bytes)
      utils
        .hexZeroPad(utils.hexlify((recipient.length - 2) / 2), 32)
        .substr(2) + // len(recipientAddress) (32 bytes)
      recipient.substr(2) // recipientAddress (?? bytes)

    try {
      const currentAllowance = await tokenContract.allowance(
        account,
        homeChain.erc20HandlerAddress
      )

      const signerBalance = await signer.getBalance()
      let fee = await networkFee(tokenAddress, amount)
      const needsApproval =
        Number(utils.formatUnits(currentAllowance, decimals)) < amount
      const needsResetApproval =
        Number(utils.formatUnits(currentAllowance, decimals)) > 0 &&
        resetAllowanceLogicFor.includes(tokenAddress.toLowerCase())

      if (signerBalance.lt(fee)) {
        setTransactionStatus('Transfer Aborted')
        setTransactionStatusReason(
          'You don\'t have enough funds to execute the transfer'
        )
        return Promise.reject()
      }

      if (needsApproval) {
        if (needsResetApproval) {
          //We need to reset the user's allowance to 0 before we give them a new allowance
          //TODO Should we alert the user this is happening here?
          await (
            await tokenContract.approve(
              homeChain.erc20HandlerAddress,
              BigNumber.from(utils.parseUnits('0', decimals)),
              {
                gasPrice: BigNumber.from(
                  utils.parseUnits(
                    (homeChain.defaultGasPrice || gasPrice).toString(),
                    9
                  )
                ).toString(),
              }
            )
          ).wait(1)
        }
        await (
          await tokenContract.approve(
            homeChain.erc20HandlerAddress,
            BigNumber.from(utils.parseUnits(amount.toString(), decimals)),
            {
              gasPrice: BigNumber.from(
                utils.parseUnits(
                  (homeChain.defaultGasPrice || gasPrice).toString(),
                  9
                )
              ).toString(),
            }
          )
        ).wait(1)
      }
      homeBridge.once(
        homeBridge.filters.Deposit(
          destinationChain.chainId,
          token.resourceId,
          null
        ),
        (destChainId, resourceId, depositNonce) => {
          setDepositNonce(`${depositNonce.toString()}`)
          setTransactionStatus('In Transit')
        }
      )

      await (
        await homeBridge.deposit(
          destinationChain.chainId,
          token.resourceId,
          data,
          {
            gasPrice: utils.parseUnits(
              (homeChain.defaultGasPrice || gasPrice).toString(),
              9
            ),
            value: utils.parseUnits((bridgeFee || 0).toString(), 18),
          }
        )
      ).wait()
      return Promise.resolve()
    } catch (error) {
      console.log(error)
      setTransactionStatus('Transfer Aborted')
      let reason =
        'Something went wrong and we could not complete your transfer.'
      if (error.code === 4001) {
        reason = 'User rejected transaction'
      }
      setTransactionStatusReason(reason)
      return Promise.reject()
    }
  }

  return (
    <ChainbridgeContext.Provider
      value={{
        homeChain: homeChain,
        destinationChain: destinationChain,
        destinationChains: destinationChains.map((c) => ({
          chainId: c.chainId,
          name: c.name,
        })),
        setDestinationChain: handleSetDestination,
        deposit,
        resetDeposit,
        depositVotes,
        relayerThreshold: relayerThreshold,
        depositNonce,
        bridgeFee,
        gasPrice,
        transactionStatus,
        inTransitMessages,
        depositAmount,
        transferTxHash,
        selectedToken,
        wrapToken: wrapper?.deposit,
        wrapTokenConfig,
        unwrapToken: wrapper?.withdraw,
        transactionStatusReason,
        networkFee,
        tokenBalance,
      }}
    >
      {children}
    </ChainbridgeContext.Provider>
  )
}

const useChainbridge = () => {
  const context = useContext(ChainbridgeContext)
  if (context === undefined) {
    throw new Error('useChainbridge must be called within a DriveProvider')
  }
  return context
}

export {ChainbridgeProvider, useChainbridge}
