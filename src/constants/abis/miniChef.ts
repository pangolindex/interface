import { Interface } from '@ethersproject/abi'
import MINICHEF_ABI from './miniChef.json'

const MINICHEF_INTERFACE = new Interface(MINICHEF_ABI)

export { MINICHEF_ABI, MINICHEF_INTERFACE }
