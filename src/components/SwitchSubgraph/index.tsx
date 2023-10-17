import React from 'react'
import { ToggleButtons } from '@honeycomb-finance/core'
import { useApplicationState } from '@honeycomb-finance/state-hooks'
import { useChainId } from 'src/hooks'

export default function SwitchSubgraph() {
  const chainId = useChainId()
  const { useSubgraph, setUseSubgraph } = useApplicationState()

  return (
    <ToggleButtons
      options={['Subgraph', 'Contract']}
      value={useSubgraph[chainId] ? 'Subgraph' : 'Contract'}
      onChange={value => {
        setUseSubgraph((state: any) => ({
          ...state,
          [chainId]: value === 'Subgraph'
        }))
        window.location.reload()
      }}
    />
  )
}
