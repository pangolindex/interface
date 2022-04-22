import { Interface } from '@ethersproject/abi'
import { abi as MINICHEF_ABI } from '@pangolindex/governance/artifacts/contracts/MiniChefV2.sol/MiniChefV2.json'

const MINICHEF_INTERFACE = new Interface(MINICHEF_ABI)

export { MINICHEF_INTERFACE }
