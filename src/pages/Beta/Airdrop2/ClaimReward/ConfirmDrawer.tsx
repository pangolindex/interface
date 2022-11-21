import React, { useContext } from 'react'
import { AlertTriangle, CheckCircle } from 'react-feather'
import { ThemeContext } from 'styled-components'
import { Box, Button, Drawer, getEtherscanLink, Loader, Text, useTranslation } from '@pangolindex/components'
import { AirdropType, Chain } from '@pangolindex/sdk'
import { Wrapper } from '../styleds'
import Title from '../Title'
import GiftBox from 'src/assets/images/giftbox.png'
import { MENU_LINK } from 'src/constants'
import { useChainId } from 'src/hooks'

interface Props {
  isOpen: boolean
  attemptingTxn: boolean
  txHash: string | null
  errorMessage: string | null
  chain: Chain
  airdropType: AirdropType
  onClose: () => void
}

const ConfirmDrawer: React.FC<Props> = props => {
  const { isOpen, attemptingTxn, errorMessage, txHash, chain, airdropType, onClose } = props

  const chainId = useChainId()

  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  const PendingContent = (
    <Wrapper>
      <Title chain={chain} title="Claiming..." />
      <Box display="flex" alignItems="center" justifyContent="center" flexGrow={1} paddingTop="20px">
        <Loader size={100} />
      </Box>
    </Wrapper>
  )

  const ErroContent = (
    <Wrapper style={{ overflowY: 'scroll' }}>
      <Title chain={chain} title="Error" color="red1" />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        flexGrow={1}
        paddingY="20px"
      >
        <AlertTriangle color={theme.red1} style={{ strokeWidth: 1.5 }} size={64} />
        <Text fontWeight={500} fontSize={16} color={'red1'} textAlign="justify" style={{ width: '85%' }}>
          {errorMessage}
        </Text>
      </Box>
      <Button variant="primary" height="46px" onClick={onClose}>
        Dimiss
      </Button>
    </Wrapper>
  )

  const SubmittedContent = (
    <Wrapper>
      <Title chain={chain} title="Success" color="green1" />
      {airdropType === AirdropType.MERKLE_TO_STAKING || airdropType === AirdropType.MERKLE_TO_STAKING_COMPLIANT ? (
        <>
          <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" flexGrow={1}>
            <img src={GiftBox} alt="GiftBox" />
            <Text fontSize={[22, 18]} fontWeight={700} color="primary" ml="10px">
              Wait its not over yet
            </Text>
          </Box>
          <Button
            variant="primary"
            color="black"
            height="46px"
            as="a"
            href={`/#${MENU_LINK.stakev2}?showClaimed=true`}
            target=""
          >
            CHECK SURPRISE
          </Button>
        </>
      ) : (
        <>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" paddingY={'20px'}>
            <Box flex="1" display="flex" alignItems="center">
              <CheckCircle color={theme.green1} style={{ strokeWidth: 1.5 }} size={64} />
            </Box>
            <Text fontSize={16} color="text1" textAlign="center">
              {t('earn.claimedReward')}
            </Text>
            {chainId && txHash && (
              <Button
                variant="primary"
                color="black"
                height="46px"
                as="a"
                href={getEtherscanLink(chainId, txHash, 'transaction')}
                target=""
              >
                {t('transactionConfirmation.viewExplorer')}
              </Button>
            )}
          </Box>
          <Button variant="primary" onClick={onClose}>
            {t('transactionConfirmation.close')}
          </Button>
        </>
      )}
    </Wrapper>
  )

  const renderBody = () => {
    if (errorMessage) {
      return ErroContent
    }
    if (txHash) {
      return SubmittedContent
    }
    if (attemptingTxn) {
      return PendingContent
    }
    return null
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      {renderBody()}
    </Drawer>
  )
}

export default ConfirmDrawer
