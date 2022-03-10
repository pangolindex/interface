import React, { useState } from 'react'
import { Text } from '@pangolindex/components'
import { StyledLogo, Separator, QuestionBox } from '../styleds'
import PlusLogo from 'src/assets/images/plus.png'
import MinusLogo from 'src/assets/images/minus.png'

export const QuestionAnswer = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const [visible2, setVisible2] = useState<boolean>(false)
  const [visible3, setVisible3] = useState<boolean>(false)

  return (
    <QuestionBox>
      <span onClick={() => setVisible(!visible)}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {visible ? <img src={MinusLogo} alt="" /> : <StyledLogo src={PlusLogo} size={'20px'} />}

          <Text fontSize={24} fontWeight={700} lineHeight="36px" color="text10">
            Is there really a troll on the bridge
          </Text>
        </span>
        {visible ? (
          <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text8">
            Well yes… And no. How it works is, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lectus
            turpis, bibendum in felis vitae, scelerisque dignissim diam. Phasellus porta pulvinar nisi quis mollis.
            Curabitur dapibus lacus enim, sed aliquam nunc mollis nec. In vel convallis ipsum. Praesent tincidunt nulla
            in mi iaculis pulvinar. Phasellus risus tortor, sodales eget mattis eget, ultrices ut sem. Nullam eget
            iaculis nisl, at consectetur dui. Nam finibus felis ac finibus rutrum.
          </Text>
        ) : (
          <></>
        )}
        <span style={{ padding: '20px' }}></span>
        <Separator />
      </span>
      <span onClick={() => setVisible2(!visible2)}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {visible2 ? <img src={MinusLogo} alt="" /> : <StyledLogo src={PlusLogo} size={'20px'} />}

          <Text fontSize={24} fontWeight={700} lineHeight="36px" color="text10">
            Is there really a troll on the bridge
          </Text>
        </span>
        {visible2 ? (
          <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text8">
            Well yes… And no. How it works is, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lectus
            turpis, bibendum in felis vitae, scelerisque dignissim diam. Phasellus porta pulvinar nisi quis mollis.
            Curabitur dapibus lacus enim, sed aliquam nunc mollis nec. In vel convallis ipsum. Praesent tincidunt nulla
            in mi iaculis pulvinar. Phasellus risus tortor, sodales eget mattis eget, ultrices ut sem. Nullam eget
            iaculis nisl, at consectetur dui. Nam finibus felis ac finibus rutrum.
          </Text>
        ) : (
          <></>
        )}
        <span style={{ padding: '20px' }}></span>
        <Separator />
      </span>
      <span onClick={() => setVisible3(!visible3)}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {visible3 ? <img src={MinusLogo} alt="" /> : <StyledLogo src={PlusLogo} size={'20px'} />}

          <Text fontSize={24} fontWeight={700} lineHeight="36px" color="text10">
            Is there really a troll on the bridge
          </Text>
        </span>
        {visible3 ? (
          <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text8">
            Well yes… And no. How it works is, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lectus
            turpis, bibendum in felis vitae, scelerisque dignissim diam. Phasellus porta pulvinar nisi quis mollis.
            Curabitur dapibus lacus enim, sed aliquam nunc mollis nec. In vel convallis ipsum. Praesent tincidunt nulla
            in mi iaculis pulvinar. Phasellus risus tortor, sodales eget mattis eget, ultrices ut sem. Nullam eget
            iaculis nisl, at consectetur dui. Nam finibus felis ac finibus rutrum.
          </Text>
        ) : (
          <></>
        )}
        <span style={{ padding: '20px' }}></span>
        <Separator />
      </span>
    </QuestionBox>
  )
}
