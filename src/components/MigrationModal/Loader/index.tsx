import React from 'react'
import { Text } from '@0xkilo/components'
import Circle from '../../../assets/images/blue-loader.svg'
import { CustomLightSpinner } from '../../../theme/components'
import { Wrapper, ConfirmedIcon, Section } from './styleds'
import { AutoColumn } from '../../Column'

interface LoaderProps {
  loadingText?: string
}

const Loader = ({ loadingText }: LoaderProps) => {
  return (
    <Wrapper>
      <Section>
        <ConfirmedIcon>
          <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
        </ConfirmedIcon>

        {loadingText && (
          <AutoColumn gap="12px" justify={'center'}>
            <Text fontWeight={500} fontSize={20} color="text1">
              {loadingText}
            </Text>
          </AutoColumn>
        )}
      </Section>
    </Wrapper>
  )
}

export default Loader
