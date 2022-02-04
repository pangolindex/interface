import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useDarkModeManager } from 'src/state/user/hooks'

import { ClaimButton, CustomizePools, Label, Value, ValueWithInfo, XStakeButton } from './styleds'
import { Card, CardHeader, CardBody, FlexWrapper } from '../styleds'
import Logo from 'src/assets/images/logo.png'
import LogoDark from 'src/assets/images/logo.png'
import Info from 'src/assets/svg/info.svg'

import PngToggle from './PngToggle'

export default function EarnedWidget() {
  const { t } = useTranslation()

  const [isDark] = useDarkModeManager()

  const [earnedCurrency, setEarnedCurrency] = useState<boolean>(false)
  const handleEarnedCurrency = (currency: boolean) => {
    setEarnedCurrency(currency)
  }

  return (
    <Card>
      <CardHeader>
        <div>{t('dashboardPage.earned')}</div>
        <PngToggle isActive={earnedCurrency} toggle={handleEarnedCurrency} leftLabel="USD" rightLabel="PNG" />
      </CardHeader>
      <CardBody>
        <Label>{t('dashboardPage.earned_dailyIncome')}</Label>
        <Value>
          2.400021 <img width={'24px'} src={isDark ? LogoDark : Logo} alt="logo" />
        </Value>
        <Label>{t('dashboardPage.earned_totalEarned')}</Label>
        <ValueWithInfo>
          <Value>
            2.400021 <img width={'24px'} src={isDark ? LogoDark : Logo} alt="logo" />
          </Value>
          <img width={'24px'} src={Info} alt="logo" />
        </ValueWithInfo>
        <FlexWrapper>
          <XStakeButton variant="outline">xStake</XStakeButton>
          <ClaimButton variant="primary">{t('dashboardPage.earned_claim')}</ClaimButton>
        </FlexWrapper>
        <CustomizePools>
          <Link to="/">Customize Pools</Link>
        </CustomizePools>
      </CardBody>
    </Card>
  )
}
