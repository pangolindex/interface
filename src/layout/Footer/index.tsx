import React, { useContext, useState } from 'react'
import { Circle } from 'react-feather'
import { Box, Text } from '@honeycomb-finance/core'
import { ThemeContext } from 'styled-components'

import { FooterFrame, Button, Policies } from './styled'
import PolicyModal from './PolicyModal'
import { PrivacyPolicy } from '../../constants/Policies/PrivacyPolicy'
import { TermsService } from '../../constants/Policies/TermsService'
import { CookiePolicy } from '../../constants/Policies/CPolicy'

export default function Footer() {
  const [selectedPolicy, setSelectPolicy] = useState<string>('')
  const theme = useContext(ThemeContext)

  const openModal = (policy: string) => {
    setSelectPolicy(policy)
  }

  const closeModal = () => {
    setSelectPolicy('')
  }

  return (
    <FooterFrame>
      <PolicyModal selectPolicy={selectedPolicy} open={selectedPolicy.length > 0} closeModal={closeModal} />
      <Policies>
        <Button fontSize={['12px', '16px']} onClick={() => openModal(PrivacyPolicy)}>
          Privacy Policy
        </Button>
        <Circle style={{ marginLeft: 10, marginRight: 10 }} size={5} stroke={theme.text1} fill={theme.text1} />
        <Button fontSize={['12px', '16px']} onClick={() => openModal(TermsService)}>
          Terms of Service
        </Button>
        <Circle style={{ marginLeft: 10, marginRight: 10 }} size={5} stroke={theme.text1} fill={theme.text1} />
        <Button fontSize={['12px', '16px']} onClick={() => openModal(CookiePolicy)}>
          Cookie Policy
        </Button>
      </Policies>
      <Box display="flex" justifyContent="center">
        <Text color="text1">Powered by</Text>
        <Text color="mustardYellow" marginLeft="5px">
          Pangolin DAO
        </Text>
      </Box>
    </FooterFrame>
  )
}
