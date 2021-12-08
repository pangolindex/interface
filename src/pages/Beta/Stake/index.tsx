import React from 'react'
import { PageWrapper, PageTitle, PoolsWrapper } from './styleds'
import PoolCard from './PoolCard'

const StakeUI = () => {
  return (
    <PageWrapper>
      <PageTitle>Stake Your PNG and Earn Rewards!</PageTitle>
      <PoolsWrapper>
        <PoolCard token="Wavax" />
        <PoolCard token="Apein" />
        <PoolCard token="Orbs" />
      </PoolsWrapper>
    </PageWrapper>
  )
}
export default StakeUI
