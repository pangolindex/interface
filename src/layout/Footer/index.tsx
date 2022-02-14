import React, { useContext, useState } from 'react'
import { Circle } from 'react-feather'
import { Box, Text } from '@pangolindex/components'
import { ThemeContext } from 'styled-components'

import { FooterFrame, Button, Policies } from './styled'
import PolicyModal from './PolicyModal'
import { PrivacyPolicy } from './Policies/PrivacyPolicy'
import { TermsService } from './Policies/TermsService'
import { CookiePolicy } from './Policies/CookiePolicy'

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
        <Button onClick={() => openModal(PrivacyPolicy)}>Privacy Policy</Button>
        <Circle style={{ marginLeft: 10, marginRight: 10 }} size={5} stroke={theme.text1} fill={theme.text1} />
        <Button onClick={() => openModal(TermsService)}>Terms of Service</Button>
        <Circle style={{ marginLeft: 10, marginRight: 10 }} size={5} stroke={theme.text1} fill={theme.text1} />
        <Button onClick={() => openModal(CookiePolicy)}>Cookie Policy</Button>
      </Policies>
      <Box display="flex">
        <Text color="text1">Powered by</Text>
        <Text color="mustardYellow" marginLeft="5px">
          Pangolin DAO
        </Text>
      </Box>
    </FooterFrame>
  )
}
