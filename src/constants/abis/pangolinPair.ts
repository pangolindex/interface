import { Interface } from '@ethersproject/abi'
import { abi as IPangolinPairABI } from '@pangolindex/exchange-contracts/artifacts/contracts/pangolin-core/interfaces/IPangolinPair.sol/IPangolinPair.json'

const PANGOLIN_PAIR_INTERFACE = new Interface(IPangolinPairABI)

export { PANGOLIN_PAIR_INTERFACE }
