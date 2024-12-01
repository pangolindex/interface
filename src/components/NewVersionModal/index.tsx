import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import BetaImage from '../../assets/images/beta-image.jpg'
import { ButtonPrimary, ButtonSecondary } from '../Button'

const Modal = styled.div<{ isOpen: boolean }>`
  width: 100vw;
  height: 100dvh;
  padding: 144px 16px;
  position: fixed;
  z-index: 9999999;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  background-color: hsla(0, 0, 7, 80%);
  visibility: hidden;
  opacity: 0;
  transition: all 0.4s;

  ${props =>
    props.isOpen &&
    css`
      visibility: visible;
      opacity: 1;
    `}

  @media (min-width: 768px) {
    padding: 144px 32px;
  }

  @media (max-height: 846px) {
    padding: 32px;
  }
`

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 12px;
  height: 100%;
  background-color: #1c1c1c;
  box-shadow: 0 251px 70px hsla(0, 0%, 0%, 0), 0 161px 64px hsla(0, 0%, 0%, 4%), 0 90px 54px hsla(0, 0%, 0%, 13%),
    0 40px 40px hsla(0, 0%, 0%, 21%), 0 10px 22px hsla(0, 0%, 0%, 25%);

  @media (min-width: 768px) {
    flex-direction: row;
  }
`

const ModalColumn = styled.div`
  flex: 1;
  height: 25%;

  @media (min-width: 768px) {
    height: auto;
  }
`

const ModalImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`

const Content = styled(ModalColumn)`
  padding: 32px 52px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
  height: 75%;

  @media (min-width: 768px) {
    height: auto;
  }
`

const ModalTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`

const ModalHeading = styled.h3`
  font-size: 24px;
  font-weight: bold;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 36px;
  }

  @media (max-height: 846px) {
    font-size: 20px;
  }
`

const ModalText = styled.p`
  margin: 0;
  text-wrap: balance;

  @media (min-width: 768px) {
    max-width: 85%;
  }
`

const BtnPrimary = styled(ButtonPrimary)`
  border-radius: 4px;
  font-size: 14px;
  color: #111;
  font-weight: semibold;
  display: inline-block;
`

const BtnSecondary = styled(ButtonSecondary)`
  border-radius: 4px;
  font-size: 14px;
  font-weight: semibold;
  display: inline-block;
`

export const NewVersionModal = () => {
  const [betaModal, setBetaModal] = useState(true)

  const toggleModal = () => {
    setBetaModal(!betaModal)
  }

  const goToBeta = () => window.open('https://beta.pangolin.exchange/', '_blank', 'noopener')

  return (
    <Modal isOpen={betaModal}>
      <ModalContent>
        <ModalColumn>
          <ModalImage src={BetaImage} />
        </ModalColumn>
        <Content>
          <ModalTextWrapper>
            <ModalHeading>Pangolin V3 Concentrated Liquidity is on the Way!</ModalHeading>
            <ModalText>
              Until then, feel free to use the classic Pangolin with original UI or explore the beta UI.
            </ModalText>
          </ModalTextWrapper>
          <Actions>
            <BtnPrimary variant="primary" onClick={goToBeta}>
              Explore the beta
            </BtnPrimary>
            <BtnSecondary variant="primary" onClick={toggleModal}>
              Return to app
            </BtnSecondary>
          </Actions>
        </Content>
      </ModalContent>
    </Modal>
  )
}
