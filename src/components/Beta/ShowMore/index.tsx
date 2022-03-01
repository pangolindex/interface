import React, { useContext } from 'react'
import { Text } from '@0xkilo/components'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Wrapper } from './styled'

interface Props {
  onToggle: () => void
  showMore: boolean
}

const ShowMore = ({ onToggle, showMore }: Props) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)

  return (
    <Wrapper onClick={() => onToggle()}>
      <Text color="text2" fontSize={16} fontWeight={500} marginLeft={'6px'} textAlign="center">
        {showMore ? t('swapPage.seeLess') : t('swapPage.seeMore')}
      </Text>

      {showMore ? (
        <ChevronUp size="16" color={theme.text2} style={{ marginLeft: '4px' }} />
      ) : (
        <ChevronDown size="16" color={theme.text2} style={{ marginLeft: '4px' }} />
      )}
    </Wrapper>
  )
}
export default ShowMore
