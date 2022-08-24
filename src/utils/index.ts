import { Contract } from '@ethersproject/contracts'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcSigner, JsonRpcProvider, TransactionResponse, TransactionReceipt } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import IPangolinRouter from '@pangolindex/exchange-contracts/artifacts/contracts/pangolin-periphery/interfaces/IPangolinRouter.sol/IPangolinRouter.json'
import { MIN_ETH, ROUTER_ADDRESS } from '../constants'
import { ChainId, JSBI, CurrencyAmount, CHAINS, TokenAmount, Currency, Token, CAVAX, Chain } from '@pangolindex/sdk'
import { parseUnits } from 'ethers/lib/utils'
import { wait } from './retry'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  43113: CHAINS[ChainId.FUJI].blockExplorerUrls?.[0] || '',
  43114: CHAINS[ChainId.AVALANCHE].blockExplorerUrls?.[0] || '',
  11111: CHAINS[ChainId.WAGMI].blockExplorerUrls?.[0] || '',
  16: CHAINS[ChainId.COSTON].blockExplorerUrls?.[0] || '',
  329847900: CHAINS[ChainId.NEAR_MAINNET].blockExplorerUrls?.[0] || '',
  329847901: CHAINS[ChainId.NEAR_TESTNET].blockExplorerUrls?.[0] || ''
}

const transactionPath = {
  [ChainId.FUJI]: 'tx',
  [ChainId.AVALANCHE]: 'tx',
  [ChainId.WAGMI]: 'tx',
  [ChainId.COSTON]: 'tx',
  [ChainId.NEAR_MAINNET]: 'transactions',
  [ChainId.NEAR_TESTNET]: 'transactions'
}

const addressPath = {
  [ChainId.FUJI]: 'address',
  [ChainId.AVALANCHE]: 'address',
  [ChainId.WAGMI]: 'address',
  [ChainId.COSTON]: 'address',
  [ChainId.NEAR_MAINNET]: 'accounts',
  [ChainId.NEAR_TESTNET]: 'accounts'
}

const blockPath = {
  [ChainId.FUJI]: 'block',
  [ChainId.AVALANCHE]: 'block',
  [ChainId.WAGMI]: 'block',
  [ChainId.COSTON]: 'block',
  [ChainId.NEAR_MAINNET]: 'blocks',
  [ChainId.NEAR_TESTNET]: 'blocks'
}

const tokenPath = {
  [ChainId.FUJI]: 'token',
  [ChainId.AVALANCHE]: 'token',
  [ChainId.WAGMI]: 'token',
  [ChainId.COSTON]: 'token',
  [ChainId.NEAR_MAINNET]: 'accounts',
  [ChainId.NEAR_TESTNET]: 'accounts'
}

export function getEtherscanLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  const prefix = `${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[43114]}`

  switch (type) {
    case 'transaction': {
      return `${prefix}/${transactionPath[chainId]}/${data}`
    }
    case 'token': {
      return `${prefix}/${tokenPath[chainId]}/${data}`
    }
    case 'block': {
      return `${prefix}/${blockPath[chainId]}/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/${addressPath[chainId]}/${data}`
    }
  }
}

export function isEvmChain(chainId: ChainId = 43114): boolean {
  if (CHAINS[chainId]?.evm) {
    return true
  }
  return false
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000))
  ]
}

// account is not optional
export function getSigner(library: JsonRpcProvider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: JsonRpcProvider, account?: string): JsonRpcProvider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: JsonRpcProvider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account))
}

// account is optional
export function getRouterContract(chainId: ChainId, library: JsonRpcProvider, account?: string): Contract {
  return getContract(ROUTER_ADDRESS[chainId], IPangolinRouter.abi, library, account)
}

// try to parse a user entered amount for a given token
export function tryParseAmount(chainId: ChainId, value?: string, currency?: Currency): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    if (typedValueParsed !== '0') {
      return currency instanceof Token
        ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
        : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed), chainId)
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return undefined
}

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(chainId: ChainId, currencyAmount?: CurrencyAmount): CurrencyAmount | undefined {
  if (!currencyAmount) return undefined
  if (chainId && currencyAmount.currency === CAVAX[chainId]) {
    if (JSBI.greaterThan(currencyAmount.raw, MIN_ETH)) {
      return CurrencyAmount.ether(JSBI.subtract(currencyAmount.raw, MIN_ETH), chainId)
    } else {
      return CurrencyAmount.ether(JSBI.BigInt(0), chainId)
    }
  }
  return currencyAmount
}

export async function waitForTransaction(
  provider: any,
  tx: TransactionResponse,
  confirmations?: number,
  timeout = 7000 // 7 seconds
) {
  const result = await Promise.race([
    tx.wait(confirmations),
    (async () => {
      await wait(timeout)
      const mempoolTx: TransactionReceipt | undefined = await provider.getTransactionReceipt(tx.hash)
      return mempoolTx
    })()
  ])
  return result
}

export async function switchNetwork(chain: Chain) {
  const { ethereum } = window

  if (ethereum && chain?.evm) {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chain?.chain_id?.toString(16)}` }]
      })
    } catch (error) {
      const err = error as any
      if (err.code === 4902) {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainName: chain.name,
              chainId: `0x${chain?.chain_id?.toString(16)}`,
              rpcUrls: [chain.rpc_uri],
              blockExplorerUrls: chain.blockExplorerUrls,
              iconUrls: chain.logo,
              nativeCurrency: chain.nativeCurrency
            }
          ]
        })
      }
    }
  }
}
