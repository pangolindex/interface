import React, { useState } from 'react'
import { ClaimBox, StyledLogo, Separator, BoxWrapper, SeparatorEmpty } from '../../styleds'
import { Text, Button } from '@antiyro/components'
import WgmLogo from 'src/assets/images/wgmlogo.png'

type IBuy = {
  buyFTM: () => void
}

export const BoxBuyCurrency: React.FC<IBuy> = ({ buyFTM }) => {
  const [selected, setSelected] = useState<number>(0)
  const [button1, setButton1] = useState<any>('outline')
  const [button2, setButton2] = useState<any>('outline')
  const [button3, setButton3] = useState<any>('outline')

  const selectAmount = (amount: number) => {
    setSelected(amount)
    if (amount === 0.1) {
      setButton1('primary')
      setButton2('outline')
      setButton3('outline')
    } else if (amount === 0.5) {
      setButton1('outline')
      setButton2('primary')
      setButton3('outline')
    } else if (amount === 1) {
      setButton1('outline')
      setButton2('outline')
      setButton3('primary')
    }
  }
  console.log(selected)

  return (
    <ClaimBox>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px' }}>
        <Text fontSize={28} fontWeight={700} lineHeight="33px" color="text10">
          You are eligible!
        </Text>
        <StyledLogo src={WgmLogo} size={'50px'} />
      </span>
      <Separator />
      <Text fontSize={12} fontWeight={500} lineHeight="18px" color="text10" mb="15px">
        You are going to need gas over there. Choose the amount you wish to spend:
      </Text>
      <BoxWrapper>
        <Button
          variant={button1}
          color="white"
          height="39px"
          borderColor="white"
          onClick={() => {
            selectAmount(0.1)
          }}
        >
          <span style={{ whiteSpace: 'nowrap', color: '#000', fontSize: '15px' }}>0.1 AVAX</span>
        </Button>
        <Button
          variant={button2}
          color="white"
          height="39px"
          borderColor="white"
          onClick={() => {
            selectAmount(0.5)
          }}
        >
          <span style={{ whiteSpace: 'nowrap', color: '#000', fontSize: '15px' }}>0.5 AVAX</span>
        </Button>
        <Button
          variant={button3}
          color="white"
          height="39px"
          borderColor="white"
          onClick={() => {
            selectAmount(1)
          }}
        >
          <span style={{ whiteSpace: 'nowrap', color: '#000', fontSize: '15px' }}>1 AVAX</span>
        </Button>
      </BoxWrapper>
      <Button variant="primary" color="white" height="46px" onClick={buyFTM}>
        <span style={{ whiteSpace: 'nowrap', color: '#000', fontSize: '20px' }}>BUY WGM</span>
      </Button>
      <SeparatorEmpty />
      <span style={{ textAlign: 'center' }}>
        <Button variant="outline" color="white" height="39px" onClick={buyFTM}>
          <span style={{ whiteSpace: 'nowrap', color: '#000', fontSize: '15px' }}>Skip</span>
        </Button>
      </span>
    </ClaimBox>
  )
}
