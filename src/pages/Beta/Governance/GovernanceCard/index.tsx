import React from 'react'
import { Text } from '@pangolindex/components'
import { useTranslation } from 'react-i18next'
import { Card, CardTitle, CardButtons, DetailsButton, VoteButton } from './styleds'
import { StyledInternalLink } from 'src/theme'

export type proposalStates =
  | 'pending'
  | 'active'
  | 'canceled'
  | 'defeated'
  | 'succeeded'
  | 'queued'
  | 'expired'
  | 'executed'

export interface GovernanceCardProps {
  id: string
  title: string
  to: string
  status: proposalStates
}

const bgColors = {
  vote: '#E67826',
  executed: 'rgba(24, 193, 69, 0.3)',
  defeated: 'rgba(232, 65, 66, 0.3)'
}

const btnColors = {
  vote: '#E6E9EC',
  executed: '#18C145',
  defeated: '#E84142'
}

const GovernanceCard = ({ id, title, to, status }: GovernanceCardProps) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardTitle>
        <Text fontSize={28} lineHeight="42px" color="text1" style={{ marginRight: '21px' }}>
          {id}.
        </Text>
        <Text fontSize={28} lineHeight="42px" color="text1">
          {title}
        </Text>
      </CardTitle>
      <CardButtons>
        <StyledInternalLink to={to} style={{ width: '100%', textDecoration: 'none' }}>
          <DetailsButton variant="outline">{t('governancePage.details')}</DetailsButton>
        </StyledInternalLink>
        <VoteButton variant="primary" color={(btnColors as any)[status]} backgroundColor={(bgColors as any)[status]}>
          {status}
        </VoteButton>
      </CardButtons>
    </Card>
  )
}
export default GovernanceCard
