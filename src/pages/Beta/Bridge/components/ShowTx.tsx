import React from 'react'
import {
  ChainId,
  CHAIN_ID_AVAX,
  CHAIN_ID_BSC,
  CHAIN_ID_ETH,
  CHAIN_ID_ETHEREUM_ROPSTEN,
  CHAIN_ID_FANTOM,
  CHAIN_ID_OASIS,
  CHAIN_ID_POLYGON,
  CHAIN_ID_TERRA
} from '@certusone/wormhole-sdk'
import { Transaction } from 'src/store/transferSlice'
import { CLUSTER, getExplorerName } from 'src/utils/bridgeUtils/consts'
import { Text, Button } from '@pangolindex/components'

export default function ShowTx({ chainId, tx }: { chainId: ChainId; tx: Transaction }) {
  const showExplorerLink =
    CLUSTER === 'testnet' || CLUSTER === 'mainnet' || (CLUSTER === 'devnet' && chainId === CHAIN_ID_TERRA)
  const explorerAddress =
    chainId === CHAIN_ID_ETH
      ? `https://${CLUSTER === 'testnet' ? 'goerli.' : ''}etherscan.io/tx/${tx?.id}`
      : chainId === CHAIN_ID_ETHEREUM_ROPSTEN
      ? `https://${CLUSTER === 'testnet' ? 'ropsten.' : ''}etherscan.io/tx/${tx?.id}`
      : chainId === CHAIN_ID_BSC
      ? `https://${CLUSTER === 'testnet' ? 'testnet.' : ''}bscscan.com/tx/${tx?.id}`
      : chainId === CHAIN_ID_POLYGON
      ? `https://${CLUSTER === 'testnet' ? 'mumbai.' : ''}polygonscan.com/tx/${tx?.id}`
      : chainId === CHAIN_ID_AVAX
      ? `https://${CLUSTER === 'testnet' ? 'testnet.' : ''}snowtrace.io/tx/${tx?.id}`
      : chainId === CHAIN_ID_OASIS
      ? `https://${CLUSTER === 'testnet' ? 'testnet.' : ''}explorer.emerald.oasis.dev/tx/${tx?.id}`
      : chainId === CHAIN_ID_FANTOM
      ? `https://${CLUSTER === 'testnet' ? 'testnet.' : ''}ftmscan.com/tx/${tx?.id}`
      : chainId === CHAIN_ID_TERRA
      ? `https://finder.terra.money/${
          CLUSTER === 'devnet' ? 'localterra' : CLUSTER === 'testnet' ? 'bombay-12' : 'columbus-5'
        }/tx/${tx?.id}`
      : undefined
  const explorerName = getExplorerName(chainId)

  const goToUrl = () => {
    window.open(explorerAddress)
  }
  return (
    <div style={{ marginTop: '10px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '10px' }}>
      <Text fontSize={2} fontWeight={100} lineHeight="8px" color="white">
        {tx.id}
      </Text>
      {showExplorerLink && explorerAddress ? (
        <Button onClick={goToUrl} target="_blank" variant="primary">
          <span style={{color: 'black'}}>View on {explorerName}</span>
        </Button>
      ) : null}
    </div>
  )
}
