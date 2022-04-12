import React from 'react'
import { useState } from 'react'
import Arrow from 'src/assets/images/arrow-bridge.png'
import ArrowUp from 'src/assets/images/arrow-bridge-up.png'

export default function ChainSelectArrow({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  const [showSwap, setShowSwap] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => {
        setShowSwap(true)
      }}
      onMouseLeave={() => {
        setShowSwap(false)
      }}
      style={{ color: 'white', cursor: 'pointer' }}
      
    >
      {showSwap ? <img src={ArrowUp} /> : <img src={Arrow} />}
    </div>
  )
}
