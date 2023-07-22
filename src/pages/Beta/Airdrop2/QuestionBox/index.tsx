import React, { useCallback, useState } from 'react'
import { Text, Box } from '@pangolindex/components'
import ReactMarkdown from 'react-markdown'
import { StyledLogo, QuestionBox, StyledLogoMinus, Separator } from '../airdrop/styleds'
import PlusLogo from 'src/assets/images/plus.png'
import MinusLogo from 'src/assets/images/minus.png'
import { AirdropQuestion } from 'src/constants/airdrop'
import { Content } from './styled'

interface QuestionAnswerProps {
  questions: AirdropQuestion[]
}

export const QuestionAnswer = ({ questions = [] }: QuestionAnswerProps) => {
  const [openQuestion, setOpenQuestion] = useState<number>(-1)

  function activeLogo(key: number) {
    if (openQuestion === key) return <StyledLogoMinus src={MinusLogo} size={'20px'} height={'4px'} />
    else return <StyledLogo src={PlusLogo} size={'20px'} />
  }

  const onToggle = useCallback(
    (index: number) => {
      if (index === openQuestion) {
        setOpenQuestion(-1)
        return
      }
      setOpenQuestion(index)
    },
    [openQuestion]
  )

  return (
    <QuestionBox>
      {questions.map((question: AirdropQuestion, index) => (
        <Box
          key={index}
          onClick={() => {
            onToggle(index)
          }}
        >
          <Box display="flex" alignItems="center" paddingTop="10px" style={{ gap: '10px' }}>
            {activeLogo(index)}
            <Text fontSize={[24, 18]} fontWeight={500} color="text10">
              {question.title}
            </Text>
          </Box>
          <Content isOpen={openQuestion === index}>
            <ReactMarkdown>{question.content}</ReactMarkdown>
          </Content>
          <Separator />
        </Box>
      ))}
    </QuestionBox>
  )
}
