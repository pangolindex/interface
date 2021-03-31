import React, {useState} from 'react'
import styled from 'styled-components'
import {AutoColumn} from '../../components/Column'
import BridgeTransferPanel from '../../components/Bridge/Transfer'
import {ChainbridgeProvider} from '../../contexts/chainbridge/ChainbridgeContext'
import {useActiveWeb3React} from '../../hooks'
import {useWalletModalToggle} from '../../state/application/hooks'
import {ButtonLight} from '../../components/Button'
import {ToggleOptions} from '../../components/Toggle'
import TokenWrappingPanel from '../../components/Bridge/Wrap'

const PageWrapper = styled(AutoColumn)`
  position: relative;
  max-width: 640px;
  width: 100%;
  background: ${({theme}) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
  0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 30px;
  padding: 1rem;
`


export default function Bridge() {

  const  {account} = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const [transferMode, toggleTransferMode] = useState<boolean>(true)

  return (
    <PageWrapper>
      { account ?
      <ChainbridgeProvider>
        <AutoColumn gap='lg' style={{width: '100%'}}>
          <ToggleOptions options = {['Cross-chain transfer', 'Wrap tokens']} isActive={transferMode} toggle={() => toggleTransferMode(!transferMode)} />
          {transferMode ?
            <BridgeTransferPanel/>
            :
            <TokenWrappingPanel/>
          }
        </AutoColumn>

      </ChainbridgeProvider> :
        <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
      }
    </PageWrapper>
  )
}
