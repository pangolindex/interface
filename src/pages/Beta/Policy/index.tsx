import React from 'react'
import ReactMarkdown from 'react-markdown'

import { PageWrapper, PolicyText } from './styled'

import { CookiePolicy } from 'src/constants/Policies/CookiePolicy'
import { PrivacyPolicy } from 'src/constants/Policies/PrivacyPolicy'
import { TermsService } from 'src/constants/Policies/TermsService'

interface Props {
  policy: string
}

const policies = {
  cookie: CookiePolicy,
  privacy: PrivacyPolicy,
  terms: TermsService
}

export default function Policy({ policy }: Props) {
  const text = policies[policy as keyof typeof policies]
  return (
    <PageWrapper>
      <PolicyText>
        <ReactMarkdown>{text}</ReactMarkdown>
      </PolicyText>
    </PageWrapper>
  )
}
