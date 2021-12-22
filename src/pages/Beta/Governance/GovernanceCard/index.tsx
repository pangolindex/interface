import React from 'react'
import { Text } from '@pangolindex/components'
import { useTranslation } from 'react-i18next'
import { Card, CardTitle, CardButtons, DetailsButton, VoteButton } from './styleds'
import { StyledInternalLink } from 'src/theme'

export interface GovernanceCardProps {
  id: string
  title: string
  to: string
  status: string
}

const bgColors = {
  Vote: '#E67826',
  Executed: 'rgba(24, 193, 69, 0.3)',
  Rejected: 'rgba(232, 65, 66, 0.3)'
}

const btnColors = {
  Vote: '#E6E9EC',
  Executed: '#18C145',
  Rejected: '#E84142'
}

const GovernanceCard = ({ id, title, to, status }: GovernanceCardProps) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardTitle>
        <Text fontSize={28} lineHeight="42px" color="text1" style={{ marginRight: '21px' }}>
          {id}
        </Text>
        <Text fontSize={28} lineHeight="42px" color="text1">
          {title}
        </Text>
      </CardTitle>
      <CardButtons>
        <DetailsButton variant="outline">{t('governancePage.details')}</DetailsButton>
        <StyledInternalLink to={to} style={{ width: '100%', textDecoration: 'none' }}>
          <VoteButton variant="primary" color={(btnColors as any)[status]} backgroundColor={(bgColors as any)[status]}>
            {status}
          </VoteButton>
        </StyledInternalLink>
      </CardButtons>
    </Card>
  )
}
export default GovernanceCard
