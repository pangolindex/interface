import React from 'react'

interface Props {
  size: number
  fillColor: string
}
const Dashboard: React.FC<Props> = props => {
  const { size, fillColor } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 21 21">
      <g id="Dashboard" transform="translate(0 -3)">
        <g id="Group_437" data-name="Group 437" transform="translate(0 3)">
          <rect id="Rectangle_203" data-name="Rectangle 203" width="10" height="7" rx="2" fill={fillColor} />
          <rect
            id="Rectangle_204"
            data-name="Rectangle 204"
            width="10"
            height="12"
            rx="2"
            transform="translate(11)"
            fill={fillColor}
          />
          <rect
            id="Rectangle_206"
            data-name="Rectangle 206"
            width="10"
            height="12"
            rx="2"
            transform="translate(0 9)"
            fill={fillColor}
          />
          <rect
            id="Rectangle_205"
            data-name="Rectangle 205"
            width="10"
            height="7"
            rx="2"
            transform="translate(11 14)"
            fill={fillColor}
          />
        </g>
      </g>
    </svg>
  )
}

export default Dashboard