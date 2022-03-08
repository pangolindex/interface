import React, { useState } from 'react'
import { StyledLogo, SeparatorBorder, QuestionBox, TableContent, FullBox } from '../styleds'
import { Text } from '@pangolindex/components'
import PlusLogo from 'src/assets/images/plus.png'
import MinusLogo from 'src/assets/images/minus.png'

const GeneralBox = () => {
    const [visible, setVisible] = useState<boolean>(false)
    const [visible2, setVisible2] = useState<boolean>(false)
    const [visible3, setVisible3] = useState<boolean>(false)

    return (
        <>
        <span onClick={() => setVisible(!visible)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {visible ? <img src={MinusLogo} alt="" /> : <StyledLogo src={PlusLogo} size={'20px'} />}
  
            <Text fontSize={24} fontWeight={500} lineHeight="36px" color="text10">
              Is there really a troll on the bridge General
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
          <SeparatorBorder />
        </span>
        <span onClick={() => setVisible2(!visible2)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {visible2 ? <img src={MinusLogo} alt="" /> : <StyledLogo src={PlusLogo} size={'20px'} />}
  
            <Text fontSize={24} fontWeight={500} lineHeight="36px" color="text10">
              Is there really a troll on the bridge General
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
          <SeparatorBorder />
        </span>
        <span onClick={() => setVisible3(!visible3)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {visible3 ? <img src={MinusLogo} alt="" /> : <StyledLogo src={PlusLogo} size={'20px'} />}
  
            <Text fontSize={24} fontWeight={500} lineHeight="36px" color="text10">
              Is there really a troll on the bridge General
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
          <SeparatorBorder />
        </span>
        </>
    )

}

const OtherQuestionBox = () => {
    const [visible, setVisible] = useState<boolean>(false)
    const [visible2, setVisible2] = useState<boolean>(false)
    const [visible3, setVisible3] = useState<boolean>(false)

    return (
        <>
        <span onClick={() => setVisible(!visible)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {visible ? <img src={MinusLogo} alt="" /> : <StyledLogo src={PlusLogo} size={'20px'} />}
  
            <Text fontSize={24} fontWeight={500} lineHeight="36px" color="text10">
              Is there really a troll on the bridge OtherQuestionBox
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
          <SeparatorBorder />
        </span>
        <span onClick={() => setVisible2(!visible2)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {visible2 ? <img src={MinusLogo} alt="" /> : <StyledLogo src={PlusLogo} size={'20px'} />}
  
            <Text fontSize={24} fontWeight={500} lineHeight="36px" color="text10">
              Is there really a troll on the bridge OtherQuestionBox
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
          <SeparatorBorder />
        </span>
        <span onClick={() => setVisible3(!visible3)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {visible3 ? <img src={MinusLogo} alt="" /> : <StyledLogo src={PlusLogo} size={'20px'} />}
  
            <Text fontSize={24} fontWeight={500} lineHeight="36px" color="text10">
              Is there really a troll on the bridge OtherQuestionBox
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
          <SeparatorBorder />
        </span>
        </>
    )

}

const BridgingBox = () => {
    const [visible, setVisible] = useState<boolean>(false)
    const [visible2, setVisible2] = useState<boolean>(false)
    const [visible3, setVisible3] = useState<boolean>(false)

    return (
        <>
        <span onClick={() => setVisible(!visible)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {visible ? <img src={MinusLogo} alt="" /> : <StyledLogo src={PlusLogo} size={'20px'} />}
  
            <Text fontSize={24} fontWeight={500} lineHeight="36px" color="text10">
              Is there really a troll on the bridge Bridging
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
          <SeparatorBorder />
        </span>
        <span onClick={() => setVisible2(!visible2)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {visible2 ? <img src={MinusLogo} alt="" /> : <StyledLogo src={PlusLogo} size={'20px'} />}
  
            <Text fontSize={24} fontWeight={500} lineHeight="36px" color="text10">
              Is there really a troll on the bridge Bridging
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
          <SeparatorBorder />
        </span>
        <span onClick={() => setVisible3(!visible3)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {visible3 ? <img src={MinusLogo} alt="" /> : <StyledLogo src={PlusLogo} size={'20px'} />}
  
            <Text fontSize={24} fontWeight={500} lineHeight="36px" color="text10">
              Is there really a troll on the bridge Bridging
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
          <SeparatorBorder />
        </span>
        </>
    )

}

const TrollQuestionBox = () => {
    const [visible, setVisible] = useState<boolean>(false)
    const [visible2, setVisible2] = useState<boolean>(false)
    const [visible3, setVisible3] = useState<boolean>(false)

    return (
        <>
        <span onClick={() => setVisible(!visible)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {visible ? <img src={MinusLogo} alt="" /> : <StyledLogo src={PlusLogo} size={'20px'} />}
  
            <Text fontSize={24} fontWeight={500} lineHeight="36px" color="text10">
              Is there really a troll on the bridge TrollQuestionBox
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
          <SeparatorBorder />
        </span>
        <span onClick={() => setVisible2(!visible2)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {visible2 ? <img src={MinusLogo} alt="" /> : <StyledLogo src={PlusLogo} size={'20px'} />}
  
            <Text fontSize={24} fontWeight={500} lineHeight="36px" color="text10">
              Is there really a troll on the bridge TrollQuestionBox
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
          <SeparatorBorder />
        </span>
        <span onClick={() => setVisible3(!visible3)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {visible3 ? <img src={MinusLogo} alt="" /> : <StyledLogo src={PlusLogo} size={'20px'} />}
  
            <Text fontSize={24} fontWeight={500} lineHeight="36px" color="text10">
              Is there really a troll on the bridge TrollQuestionBox
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
          <SeparatorBorder />
        </span>
        </>
    )

}

const TrollFeeBox = () => {
    const [visible, setVisible] = useState<boolean>(false)
    const [visible2, setVisible2] = useState<boolean>(false)
    const [visible3, setVisible3] = useState<boolean>(false)

    return (
        <>
        <span onClick={() => setVisible(!visible)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {visible ? <img src={MinusLogo} alt="" /> : <StyledLogo src={PlusLogo} size={'20px'} />}
  
            <Text fontSize={24} fontWeight={500} lineHeight="36px" color="text10">
              Is there really a troll on the bridge TrollFeeBox
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
          <SeparatorBorder />
        </span>
        <span onClick={() => setVisible2(!visible2)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {visible2 ? <img src={MinusLogo} alt="" /> : <StyledLogo src={PlusLogo} size={'20px'} />}
  
            <Text fontSize={24} fontWeight={500} lineHeight="36px" color="text10">
              Is there really a troll on the bridge TrollFeeBox
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
          <SeparatorBorder />
        </span>
        <span onClick={() => setVisible3(!visible3)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {visible3 ? <img src={MinusLogo} alt="" /> : <StyledLogo src={PlusLogo} size={'20px'} />}
  
            <Text fontSize={24} fontWeight={500} lineHeight="36px" color="text10">
              Is there really a troll on the bridge TrollFeeBox
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
          <SeparatorBorder />
        </span>
        </>
    )

}

export const QuestionAnswer = () => {
    const [general, setGeneral] = useState<boolean>(true)
    const [otherQuestion, setOtherQuestion] = useState<boolean>(false)
    const [bridging, setBridging] = useState<boolean>(false)
    const [trollQuestions, setTrollQuestions] = useState<boolean>(false)
    const [trollFee, setTrollFee] = useState<boolean>(false)



    
    const showGeneral = () => {
        setGeneral(true)
        setOtherQuestion(false)
        setBridging(false)
        setTrollQuestions(false)
        setTrollFee(false)
    }

    const showOtherQuestion = () => {
        setGeneral(false)
        setOtherQuestion(true)
        setBridging(false)
        setTrollQuestions(false)
        setTrollFee(false)
    }

    const showBridging = () => {
        setGeneral(false)
        setOtherQuestion(false)
        setBridging(true)
        setTrollQuestions(false)
        setTrollFee(false)
    }

    const showTrollQuestions = () => {
        setGeneral(false)
        setOtherQuestion(false)
        setBridging(false)
        setTrollQuestions(true)
        setTrollFee(false)
    }

    const showTrollFee = () => {
        setGeneral(false)
        setOtherQuestion(false)
        setBridging(false)
        setTrollQuestions(false)
        setTrollFee(true)
    }
  
    return (
    <FullBox>
      <TableContent>
        <Text fontSize={21} fontWeight={500} lineHeight="32px" color="text10" padding={10}>
            Table of Content
        </Text>
        {general ? (
            <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text10" padding={10} onClick={showGeneral}>
                General
            </Text>
        ) : (
            <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text8" padding={10} onClick={showGeneral}>
                General
            </Text>
        )}
        {otherQuestion ? (
        <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text10" padding={10} onClick={showOtherQuestion}>
            Other Questions
        </Text>
        ) : (
        <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text8" padding={10} onClick={showOtherQuestion}>
            Other Questions
        </Text>
        )}

        {bridging ? (
        <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text10" padding={10} onClick={showBridging}>
            Bridging For Noobs
        </Text>
        ) : (
        <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text8" padding={10} onClick={showBridging}>
            Bridging For Noobs
        </Text>
        )}
        {trollQuestions ? (
        <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text10" padding={10} onClick={showTrollQuestions}>
            Troll Related Questions
        </Text>
        ) : (
        <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text8" padding={10} onClick={showTrollQuestions}>
            Troll Related Questions
        </Text>
        )}
        {trollFee ? (
        <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text10" padding={10} onClick={showTrollFee}>
            Troll Fee Problems
        </Text>
        ) : (
        <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text8" padding={10} onClick={showTrollFee}>
            Troll Fee Problems
        </Text>
        )}
      </TableContent>
      <QuestionBox>
        <Text fontSize={32} fontWeight={500} lineHeight="48px" color="text10">
            Have Questions? Look Here:
        </Text>
        <span style={{ padding: '20px' }}></span>
        { general ? (<GeneralBox />) : <></> }
        { otherQuestion ? (<OtherQuestionBox />) : <></> }
        { bridging ? (<BridgingBox />) : <></> }
        { trollQuestions ? (<TrollQuestionBox />) : <></> }
        { trollFee ? <TrollFeeBox /> : <></>}
      </QuestionBox>
    </FullBox>
    )
  }