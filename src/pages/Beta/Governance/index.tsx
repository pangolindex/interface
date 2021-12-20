import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from '@pangolindex/components'
import { PageWrapper, PageTitle, ContentWrapper, About } from './styleds'
import GovernanceCard from './GovernanceCard'

const GovernanceUI = () => {
  const { t } = useTranslation()

  return (
    <PageWrapper>
      <PageTitle>{t('governancePage.pangolinGovernance')}</PageTitle>
      <ContentWrapper>
        <About>
          <Text fontSize={28} fontWeight={800} lineHeight="33px" color="text1" style={{ marginBottom: '14px' }}>
            {t('governancePage.about')}
          </Text>
          <Text fontSize={16} lineHeight="24px" color="text1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sed aliquet justo, tristique luctus est.
            Curabitur cursus lectus laoreet velit lacinia aliquam. Sed vitae elit vestibulum, viverra tortor quis,
            ultrices ipsum. Mauris cursus enim lobortis, tincidunt purus a, ultricies dui. Nullam fermentum ante lorem,
            at convallis ante fringilla at. Nullam molestie rutrum ipsum, ac venenatis mauris tincidunt eu. Duis et
            risus pretium, vestibulum nulla ut
          </Text>
        </About>
        <GovernanceCard voteStatus={t('governancePage.vote')} />
        <GovernanceCard voteStatus={t('governancePage.vote')} />
        <GovernanceCard voteStatus={t('governancePage.rejected')} />
        <GovernanceCard voteStatus={t('governancePage.executed')} />
      </ContentWrapper>
    </PageWrapper>
  )
}
export default GovernanceUI
