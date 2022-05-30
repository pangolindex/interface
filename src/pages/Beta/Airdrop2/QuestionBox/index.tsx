import React, { useState } from 'react'
import { Text } from '@pangolindex/components'
import { StyledLogo, QuestionBox } from '../styleds'
import PlusLogo from 'src/assets/images/plus.png'
import MinusLogo from 'src/assets/images/minus.png'
import styled from 'styled-components'
import { Questions, useGetQuestions } from 'src/state/airdrop/hooks'

const QuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
`

const JustifyText = styled.div`
  text-align: justify;
`

export const QuestionAnswer = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const { data: questions } = useGetQuestions('Airdrop')

  return (
    <QuestionBox>
      {questions &&
        questions.map((e: Questions) => (
          <div key={e.id} onClick={() => setVisible(!visible)}>
            <QuestionWrapper>
              {visible ? <img src={MinusLogo} alt="" /> : <StyledLogo src={PlusLogo} size={'20px'} />}
              <Text fontSize={24} fontWeight={700} lineHeight="36px" color="text10">
                {e?.title}
              </Text>
            </QuestionWrapper>
            {visible ? (
              <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text8">
                <JustifyText>{e?.content}</JustifyText>
              </Text>
            ) : (
              <></>
            )}
          </div>
        ))}
    </QuestionBox>
  )
}
