import {injected} from "../connectors";
import {AVALANCHE_CHAIN_PARAMS} from "../constants";

export function addAvalancheNetwork() {
  injected.getProvider().then(provider => {
    provider
      .request({
        method: 'wallet_addEthereumChain',
        params: [AVALANCHE_CHAIN_PARAMS]
      })
      .catch((error: any) => {
        console.log(error)
      })
  })
}