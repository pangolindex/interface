import React from 'react'
import { Button } from '@pangolindex/components'


const ToggleConnectedButton = ({
  connect,
  disconnect,
  connected,
  pk
}: {
  connect(): any
  disconnect(): any
  connected: boolean
  pk: string
}) => {
  const is0x = pk.startsWith('0x')
  return connected ? (
      <Button
        variant="primary"
        onClick={disconnect}
      >
          Disconnect {pk.substring(0, is0x ? 6 : 3)}...
          {pk.substr(pk.length - (is0x ? 4 : 3))}
      </Button>
  ) : (
    <Button variant="primary" onClick={connect}>
        Connect
    </Button>
  )
}

export default ToggleConnectedButton
