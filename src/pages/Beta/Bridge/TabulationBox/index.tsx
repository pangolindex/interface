import React, { useState } from 'react'
import { QuestionBox, TableContent, FullBox } from '../styleds'
import { Text } from '@pangolindex/components'
import { Questions, useGetQuestions } from 'src/state/bridge/hooks'

export const QuestionAnswer = () => {
  const [content, setContent] = useState<string>("")
  const [active, setActive] = useState<number>()

  const { data: questions } = useGetQuestions()
  function activeText(index: number | undefined, key: number) {
    if (index === key)
      return "text10"
    else
      return "text8"
  }
  return (
    <FullBox>
      <TableContent>
        <Text fontSize={21} fontWeight={500} lineHeight="32px" color="text10" padding={10}>
          Table of Content
        </Text>
        {questions &&
          questions.map((e: Questions, i: number) => (
            <Text fontSize={14} fontWeight={500} lineHeight="21px" color={activeText(active, e?.id)} padding={10} onClick={() => { setContent(e.content); setActive(e.id) }} key={e.id}>
              {e?.title}
            </Text>
          ))}
      </TableContent>
      <QuestionBox>
        <Text fontSize={32} fontWeight={500} lineHeight="48px" color="text10">
          Have Questions? Look Here:
        </Text>
        <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text10" paddingTop={30}>
          {content}
        </Text>
      </QuestionBox>
    </FullBox>
  )
}
