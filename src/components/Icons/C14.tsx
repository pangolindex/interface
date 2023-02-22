import React from 'react'

interface Props {
  size: number
  fillColor: string
}
const C14: React.FC<Props> = props => {
  const { size } = props
  return (
    <svg width={size} height={size} viewBox="0 0 175 175" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="175" height="175" rx="87.5" fill="#FD7F3A" />
      <rect x="84" y="152" width="8" height="8" fill="#FFFAF8" />
      <rect x="77" y="139" width="8" height="8" fill="#FFFAF8" />
      <rect x="66" y="126" width="44" height="8" fill="#FFFAF8" />
      <rect x="108" y="97" width="40" height="8" transform="rotate(-90 108 97)" fill="#FFFAF8" />
      <rect x="60" y="97" width="40" height="8" transform="rotate(-90 60 97)" fill="#FFFAF8" />
      <rect x="68" y="57" width="14" height="8" transform="rotate(-90 68 57)" fill="#FFFAF8" />
      <rect x="100" y="57" width="14" height="8" transform="rotate(-90 100 57)" fill="#FFFAF8" />
      <rect x="76" y="43" width="14" height="8" transform="rotate(-90 76 43)" fill="#FFFAF8" />
      <rect x="92" y="43" width="14" height="8" transform="rotate(-90 92 43)" fill="#FFFAF8" />
      <rect x="110" y="118" width="22" height="8" fill="#FFFAF8" />
      <rect x="44" y="118" width="22" height="8" fill="#FFFAF8" />
      <rect x="124" y="118" width="13" height="8" transform="rotate(-90 124 118)" fill="#FFFAF8" />
      <rect x="44" y="118" width="13" height="8" transform="rotate(-90 44 118)" fill="#FFFAF8" />
      <rect x="91" y="139" width="8" height="8" fill="#FFFAF8" />
      <rect x="92" y="104" width="8" height="8" fill="#FFFAF8" />
      <rect x="92" y="72" width="8" height="8" fill="#FFFAF8" />
      <rect x="116" y="97" width="8" height="8" fill="#FFFAF8" />
      <rect x="84" y="21" width="8" height="8" fill="#FFFAF8" />
      <rect x="52" y="97" width="8" height="8" fill="#FFFAF8" />
      <rect x="84" y="96" width="8" height="8" fill="#FFFAF8" />
      <rect x="84" y="64" width="8" height="8" fill="#FFFAF8" />
      <rect x="84" y="112" width="8" height="8" fill="#FFFAF8" />
      <rect x="84" y="80" width="8" height="8" fill="#FFFAF8" />
      <rect x="76" y="104" width="8" height="8" fill="#FFFAF8" />
      <rect x="76" y="72" width="8" height="8" fill="#FFFAF8" />
    </svg>
  )
}

export default C14
