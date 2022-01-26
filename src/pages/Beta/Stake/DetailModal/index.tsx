import React, { useContext } from 'react'
import { ApplicationModal } from 'src/state/application/actions'
import { useModalOpen, useSingleSideStakingDetailnModalToggle } from 'src/state/application/hooks'
import { SingleSideStakingInfo } from 'src/state/stake/hooks'
import { ThemeContext } from 'styled-components'
import Modal from 'src/components/Beta/Modal'
import { Wrapper, DetailsWrapper, Tab, Tabs, LeftSection, RightSection } from './styled'
import Header from './Header'
import Details from './Details'
import StakeWidget from './StakeWidget'
import EarnedWidget from './EarnedWidget'

type Props = {
  stakingInfo: SingleSideStakingInfo
  onClose: () => void
}

const DetailModal: React.FC<Props> = ({ stakingInfo, onClose }) => {
  const isDetailModalOpen = useModalOpen(ApplicationModal.SINGLE_SIDE_STAKE_DETAIL)
  const toggleModal = useSingleSideStakingDetailnModalToggle()
  const theme = useContext(ThemeContext)

  return (
    <Modal isOpen={isDetailModalOpen} onDismiss={toggleModal} overlayBG={theme.modalBG2}>
      <Wrapper>
        <Header stakingInfo={stakingInfo} onClose={onClose} />
        <DetailsWrapper>
          <LeftSection>
            <Tabs>
              <Tab>Details</Tab>
            </Tabs>
            <Details stakingInfo={stakingInfo} />
          </LeftSection>
          <RightSection>
            <StakeWidget stakingInfo={stakingInfo} />
            <EarnedWidget stakingInfo={stakingInfo} />
          </RightSection>
        </DetailsWrapper>
      </Wrapper>
    </Modal>
  )
}

export default DetailModal
