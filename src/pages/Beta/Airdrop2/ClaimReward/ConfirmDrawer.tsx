import React, { useContext, useState } from 'react'
import { AlertTriangle } from 'react-feather'
import { ThemeContext } from 'styled-components'
import { Box, Button, Drawer, Loader, Modal, Text, useSarPositions } from '@pangolindex/components'
import { Chain } from '@pangolindex/sdk'
import { Wrapper } from '../styleds'
import Title from '../Title'
import GiftBox from 'src/assets/images/giftbox.png'
import Confetti from 'src/components/Confetti'

interface Props {
  isOpen: boolean
  attemptingTxn: boolean
  txHash: string | null
  errorMessage: string | null
  chain: Chain
  onClose: () => void
}

const ConfirmDrawer: React.FC<Props> = props => {
  const { isOpen, attemptingTxn, errorMessage, txHash, chain, onClose } = props

  const [openModal, setOpenModal] = useState(false)

  const { data: positions } = useSarPositions()

  const theme = useContext(ThemeContext)

  const PendingContent = (
    <Wrapper>
      <Title chain={chain} title="Claiming..." />
      <Box display="flex" alignItems="center" justifyContent="center" flexGrow={1} paddingTop="20px">
        <Loader size={100} />
      </Box>
    </Wrapper>
  )

  const ErroContent = (
    <Wrapper>
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
        <Text fontWeight={500} fontSize={16} color={'red1'} textAlign="center" style={{ width: '85%' }}>
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
      <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" flexGrow={1}>
        <img src={GiftBox} alt="GiftBox" />
        <Text fontSize={[22, 18]} fontWeight={700} color="primary" ml="10px">
          Wait its not over yet
        </Text>
      </Box>
      <Button variant="primary" color="black" height="46px" onClick={() => setOpenModal(true)}>
        CHECK SURPRISE
      </Button>
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

  const lastPostion = positions && positions.length > 0 ? positions[positions.length - 1] : null

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      {renderBody()}
      <Modal isOpen={openModal} onDismiss={() => setOpenModal(false)}>
        <Confetti start={openModal} />
        {positions && positions.length > 0 && (
          <img src={lastPostion?.uri?.image} alt="NFT" style={{ height: '400px' }} />
        )}
      </Modal>
    </Drawer>
  )
}

export default ConfirmDrawer
