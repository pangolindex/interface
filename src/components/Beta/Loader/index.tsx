import React from 'react'
import { Box, Text } from '@pangolindex/components'
import LogoIcon from 'src/assets/svg/logoIcon.svg'
import { Loading } from 'src/components/Icons'
import styled from 'styled-components'

const PendingWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`

interface Props {
  size: number
  label?: string
}
const Loader: React.FC<Props> = props => {
  const { size, label } = props
  return (
    <PendingWrapper>
      <Box mb={'15px'} display="flex" alignItems="center" flexDirection="column">
        <Box width={size} height={size} position="relative" display="flex" alignItems="center" justifyContent="center">
          <Loading />

          <Box position="absolute">
            <img src={LogoIcon} alt="logo" />
          </Box>
        </Box>
        {label && (
          <Text fontWeight={500} fontSize={20} color="text1" textAlign="center" mt={10}>
            {label}
          </Text>
        )}
      </Box>
    </PendingWrapper>
  )
}

export default Loader
