import React from 'react'
import { Box, Steps, Step } from '@0xkilo/components'
import { PValue } from './styled'

interface Props {
  onChangePercentage: (value: number) => void
  currentValue: number
  isDisabled?: boolean
  variant: 'step' | 'plain' | 'box'
}

const Percentage = ({ onChangePercentage, currentValue, isDisabled, variant }: Props) => {
  const percentageValue = [1, 2, 3, 4]

  return (
    <Box>
      {variant === 'step' && (
        <Steps
          onChange={value => {
            onChangePercentage && onChangePercentage(value)
          }}
          current={currentValue}
          progressDot={true}
        >
          <Step disabled={isDisabled} />
          <Step disabled={isDisabled} />
          <Step disabled={isDisabled} />
          <Step disabled={isDisabled} />
          <Step disabled={isDisabled} />
        </Steps>
      )}

      {variant === 'box' && (
        <Box display="flex" pb="5px">
          {percentageValue.map((value, index) => (
            <PValue
              key={index}
              isActive={currentValue === value}
              onClick={() => {
                onChangePercentage && onChangePercentage(value)
              }}
            >
              {value * 25}%
            </PValue>
          ))}
        </Box>
      )}
    </Box>
  )
}
export default Percentage
