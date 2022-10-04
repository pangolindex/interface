/// <reference types="react-scripts" />

declare module '@metamask/jazzicon' {
  export default function(diameter: number, seed: number): HTMLElement
}

declare module 'fortmatic'

interface Window {
  WalletLinkProvider?: any
  walletLinkExtension?: any
  xfi?: any
  bitkeep?: any
  isBitKeep?: true
  ethereum?: {
    isCoinbaseWallet?: boolean
    isMetaMask?: true
    isXDEFI?: true
    isRabby?: true
    isTalisman?: true
    on?: (...args: any[]) => void
    removeListener?: (...args: any[]) => void
    request: (...args: any[]) => Promise<any>
    getBlock?: (block) => Promise<any>
    getTransactionReceipt?: (hash) => Promise<any>
    getBlockNumber?: () => Promise<any>
    execute?: (method, params) => Promise<any>
  }
  web3?: {}
  pendo?: any
}

declare module 'content-hash' {
  declare function decode(x: string): string
  declare function getCodec(x: string): string
}

declare module 'multihashes' {
  declare function decode(buff: Uint8Array): { code: number; name: string; length: number; digest: Uint8Array }
  declare function toB58String(hash: Uint8Array): string
}
