import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
// import { ArrowUpCircle } from 'react-feather'
import { Text, Box } from '@pangolindex/components'

import { AutoColumn, ColumnCenter } from '../../Column'
import { RowBetween } from '../../Row'
import { CustomLightSpinner } from 'src/theme'
import { ExternalLink, BetaCloseIcon } from 'src/theme/components'
import { useActiveWeb3React } from 'src/hooks'
import { getEtherscanLink } from 'src/utils'

import Logo from 'src/assets/images/logo.svg'
import Circle from 'src/assets/images/orange-loader.svg'
import ArrowCheckCircle from 'src/assets/images/arrow-check-circle.svg'

const ConfirmOrLoadingWrapper = styled.div`
  width: 100%;
  padding: 24px;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 30px 0;
  position: relative;
`

const LogoIcon = styled(Box)`
  position: absolute;
  top: 42%;
  left: 44.5%;
`

export function LoadingView({ children, onDismiss }: { children: any; onDismiss: () => void }) {
  const { t } = useTranslation()
  return (
    <ConfirmOrLoadingWrapper>
      <ConfirmedIcon>
        <CustomLightSpinner src={Circle} alt="loader" size={'122px'} />
        <LogoIcon>
          <img src={Logo} alt="pangolin" />
        </LogoIcon>
      </ConfirmedIcon>
      <AutoColumn gap="100px" justify={'center'}>
        {children}
        <Text fontSize={12} fontWeight={400} lineHeight={'18px'} color="text14">
          {t('modalView.confirmTransaction')}
        </Text>
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  )
}

export function SubmittedView({
  children,
  onDismiss,
  hash
}: {
  children: any
  onDismiss: () => void
  hash: string | undefined
}) {
  // const theme = useContext(ThemeContext)
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <BetaCloseIcon onDismiss={onDismiss} />
      </RowBetween>
      <ConfirmedIcon style={{ padding: '3px 0px 50px' }}>
        <img src={ArrowCheckCircle} alt="arrow check circle" />
        {/* <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary1} /> */}
      </ConfirmedIcon>
      <AutoColumn gap="45px" justify={'center'}>
        {children}
        {chainId && hash && (
          <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')} style={{ marginLeft: '4px' }}>
            <Text fontSize={12} fontWeight={500} lineHeight={'18px'} color="text15">
              {t('modalView.viewTransaction')}
            </Text>
          </ExternalLink>
        )}
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  )
}
