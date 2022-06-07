import React, { useState } from 'react'
import { Text } from '@pangolindex/components'
import { StyledLogo, QuestionBox, StyledLogoMinus, Separator } from '../styleds'
import PlusLogo from 'src/assets/images/plus.png'
import MinusLogo from 'src/assets/images/minus.png'
import { SubCategories, useGetKnowledgeData, QuestionAnswerType } from 'src/state/bridge/hooks'

export const QuestionAnswer = () => {
  const [open, setOpen] = useState<number>()
  const [text, setText] = useState<string>('')
  const { data: questions } = useGetKnowledgeData(QuestionAnswerType.Airdrop, QuestionAnswerType.Undefined)

  function activeLogo(key: number) {
    if (open === key) return <StyledLogoMinus src={MinusLogo} size={'20px'} height={'4px'} />
    else return <StyledLogo src={PlusLogo} size={'20px'} />
  }

  function activeText(key: number) {
    if (open === key) {
      return (
        <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text8" paddingX={31}>
          {text}
        </Text>
      )
    } else {
      return <></>
    }
  }

  function deactivate(key: number) {
    if (open === key) {
      setOpen(undefined)
    }
  }
  return (
    <QuestionBox>
      {questions &&
        questions.map((question: SubCategories) => (
          <div
            key={question.id}
            onClick={() => {
              setOpen(question.id)
              setText(question.content)
              deactivate(question.id)
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {activeLogo(question?.id)}
              <Text fontSize={24} fontWeight={500} lineHeight="36px" color="text10">
                {question.title}
              </Text>
            </span>
            {activeText(question?.id)}
            <Separator />
          </div>
        ))}
    </QuestionBox>
  )
}
