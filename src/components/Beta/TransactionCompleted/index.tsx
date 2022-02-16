import React, { useContext } from 'react'
import { Box, Text } from '@pangolindex/components'
import { Root } from './styled'
import CircleTick from 'src/assets/svg/circleTick.svg'
import { CloseIcon } from 'src/theme/components'
import { ThemeContext } from 'styled-components'

interface Props {
  onClose: () => void
  submitText?: string
  showCloseIcon?: boolean
}

const TransactionCompleted = ({ onClose, submitText, showCloseIcon }: Props) => {
  const theme = useContext(ThemeContext)
  return (
    <Root>
      {showCloseIcon && (
        <Box display="flex" justifyContent="flex-end">
          <CloseIcon onClick={onClose} color={theme.text4} />
        </Box>
      )}

      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" flex={1} paddingY={'20px'}>
        <Box display="flex" alignItems="center" mb={10}>
          <img src={CircleTick} alt="circle-tick" />
        </Box>
        {submitText && (
          <Text fontWeight={500} fontSize={20} color="text1">
            {submitText}
          </Text>
        )}
      </Box>
    </Root>
  )
}
export default TransactionCompleted
