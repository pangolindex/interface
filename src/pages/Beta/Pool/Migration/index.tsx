import React from 'react'
import { PageWrapper } from './styleds'
import MigrationView from 'src/components/MigrationModal/StepView'

const Migration = () => {
  return (
    <PageWrapper>
      <MigrationView version={1} />
    </PageWrapper>
  )
}
export default Migration
