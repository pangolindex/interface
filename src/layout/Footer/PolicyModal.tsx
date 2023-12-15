import React from 'react'
import { Box, Modal } from '@honeycomb-finance/core'
import ReactMarkdown from 'react-markdown'
import { Scrollbars } from 'react-custom-scrollbars'
import { CloseButton, Content, PolicyText } from './styled'

interface Props {
  selectPolicy: string
  open: boolean
  closeModal: () => void
}

export default function PolicyModal({ selectPolicy, open, closeModal }: Props) {
  return (
    <Modal isOpen={open} onDismiss={closeModal}>
      <Box position="relative">
        <CloseButton onClick={closeModal} />
      </Box>
      <Content padding={30}>
        <Scrollbars style={{ width: '100%', height: '100%' }}>
          <PolicyText>
            <ReactMarkdown>{selectPolicy}</ReactMarkdown>
          </PolicyText>
        </Scrollbars>
      </Content>
    </Modal>
  )
}
