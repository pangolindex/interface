import React from 'react'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { RowBetween } from "../Row";
import { TYPE, CloseIcon } from '../../theme'
import { Link } from "react-router-dom";
import { ButtonSecondary } from "../Button";
import { AUTOCOMPOUNDERS } from "./compounders";

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

interface AutoCompounderModalModalProps {
  isOpen: boolean
  onDismiss: () => void
}

export default function AutoCompounderModal({ isOpen, onDismiss }: AutoCompounderModalModalProps) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={250}>
      <ContentWrapper gap="lg">
        <RowBetween>
          <TYPE.mediumHeader>Auto Compounders</TYPE.mediumHeader>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>

        <AutoColumn gap={'sm'}>
          {
            AUTOCOMPOUNDERS.map((autocompounder) => (
              <ButtonSecondary
                key={autocompounder.name}
                style={{ backgroundColor: 'transparent' }}
                as={Link}
                to={autocompounder.url}
              >
                {autocompounder.name}↗
              </ButtonSecondary>
            ))
          }
        </AutoColumn>

      </ContentWrapper>
    </Modal>
  )
}
