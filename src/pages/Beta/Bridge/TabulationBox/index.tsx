import React, { useState } from 'react'
import { QuestionBox, TableContent, FullBox } from '../styleds'
import { Text, useTranslation } from '@pangolindex/components'
import { GeneralBox } from './QuestionBoxGeneral'
import { SubCategories, useGetKnowledgeData, QuestionAnswerType } from 'src/state/bridge/hooks'

interface ShortArray {
  id: number
  subcategory: string
}

export const QuestionAnswer = () => {
  const [subcategory, setSubCategory] = useState<string>('General')
  const { t } = useTranslation()
  const [active, setActive] = useState<number>(0)
  const { data: questions } = useGetKnowledgeData(QuestionAnswerType.Bridge, QuestionAnswerType.Undefined)
  const duplicate = questions && questions.map((e: SubCategories) => ({ id: e.id, subcategory: e.subcategory }))
  const tabs: ShortArray[] = []

  duplicate?.forEach(function(item) {
    const existing = tabs.filter(function(v: ShortArray) {
      return v.subcategory === item.subcategory
    })
    if (!existing.length) tabs.push(item)
  })

  function activeTab(key: number) {
    if (active === key) return 'text10'
    else if (String(active) === '0' && String(key) === '2') return 'text10'
    else return 'text8'
  }

  const handleChange = (selected: number, sub: string) => {
    setActive(selected)
    setSubCategory(sub)
  }

  return (
    <FullBox>
      <TableContent>
        <Text fontSize={21} fontWeight={500} lineHeight="32px" color="text10" padding={10}>
          {t('bridge.tableOfContent')}
        </Text>
        {tabs &&
          tabs.map((tab: ShortArray) => (
            <Text
              fontSize={14}
              fontWeight={500}
              lineHeight="21px"
              color={activeTab(tab?.id)}
              padding={10}
              onClick={() => {
                handleChange(tab.id, tab.subcategory)
              }}
              key={tab.id}
            >
              {tab.subcategory}
            </Text>
          ))}
      </TableContent>
      <QuestionBox>
        <Text fontSize={32} fontWeight={500} lineHeight="48px" color="text10" paddingBottom={20}>
          {t('bridge.haveQuestion')}
        </Text>
        <GeneralBox subcategory={subcategory} />
      </QuestionBox>
    </FullBox>
  )
}
