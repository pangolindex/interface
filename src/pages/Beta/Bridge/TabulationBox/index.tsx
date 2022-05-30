import React, { useState } from 'react'
import { QuestionBox, TableContent, FullBox } from '../styleds'
import { Text } from '@pangolindex/components'
import { GeneralBox } from './QuestionBoxGeneral'
import { AxelarBox } from './QuestionBoxAxelar'

export const QuestionAnswer = () => {
  const categories = [{id: 0, content: 'General'}, {id: 1, content: 'Axelar'}]
  const [subcategory, setSubCategory] = useState<string>('General')
  const [active, setActive] = useState<number>(0)

  function activeText(index: number | undefined, key: number) {
    if (index === key)
      return "text10"
    else
      return "text8"
  }

  function renderBox() {
    if (subcategory === 'General')
      return <GeneralBox subcategory='General' />
    else if (subcategory === 'Axelar')
      return <AxelarBox />
    else
      return <></>
  }
  return (
    <FullBox>
      <TableContent>
        <Text fontSize={21} fontWeight={500} lineHeight="32px" color="text10" padding={10}>
          Table of Content
        </Text>
        {categories &&
          categories.map((tab: any) => (
            <Text fontSize={14} fontWeight={500} lineHeight="21px" color={activeText(active, tab?.id)} padding={10} onClick={() => { setActive(tab.id); setSubCategory(tab.content) }} key={tab.id}>
              {tab.content}
            </Text>
          ))}
      </TableContent>
      <QuestionBox>
        <Text fontSize={32} fontWeight={500} lineHeight="48px" color="text10" paddingBottom={20}>
          Have Questions? Look Here:
        </Text>
        {renderBox()}
      </QuestionBox>
    </FullBox>
  )
}
