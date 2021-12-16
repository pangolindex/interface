import React from 'react'
import { Text } from '@pangolindex/components'
import { useTranslation } from 'react-i18next'
import { Card, CardTitle, CardButtons, DetailsButton, VoteButton } from './styleds'

export interface GovernanceCardProps {
  title?: string
  detailLink?: string
  voteStatus: string
  voteLink?: string
}

const GovernanceCard = ({ title, detailLink, voteStatus, voteLink }: GovernanceCardProps) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardTitle>
        <Text fontSize={28} lineHeight="42px" color="text1" style={{ marginRight: '21px' }}>
          1.
        </Text>
        <Text fontSize={28} lineHeight="42px" color="text1">
          Increase Governance Agility
        </Text>
      </CardTitle>
      <CardButtons>
        <DetailsButton variant="outline">{t('governancePage.details')}</DetailsButton>
        <VoteButton variant="primary" bg={voteStatus}>
          {voteStatus}
        </VoteButton>
      </CardButtons>
    </Card>
  )
}
export default GovernanceCard
