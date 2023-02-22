import React from 'react'

interface Props {
  size: number
  fillColor: string
}
const C14: React.FC<Props> = props => {
  const { size } = props
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#FD7F3A" />
    </svg>
  )
}

export default C14
