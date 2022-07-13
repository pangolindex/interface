import React from 'react'
import { Text, useTranslation } from '@pangolindex/components'
import { Wrapper } from './styled'

const ComingSoon = () => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <Text color="text2" fontSize={16} fontWeight={500} marginLeft={'6px'} textAlign="center">
        {t('swapPage.comingSoon')}
      </Text>
    </Wrapper>
  )
}
export default ComingSoon
