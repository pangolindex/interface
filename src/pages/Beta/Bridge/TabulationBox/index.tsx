import React, { useState } from 'react'
import { QuestionBox, TableContent, FullBox } from '../styleds'
import { Text } from '@pangolindex/components'
import { GeneralBox } from './QuestionBoxGeneral'
import { AxelarBox } from './QuestionBoxAxelar'
import { Questions, useGetQuestions } from 'src/state/airdrop/hooks'

export const QuestionAnswer = () => {
  const [subcategory, setSubCategory] = useState<string>('General')
  const [active, setActive] = useState<number>(0)
  const { data: questions } = useGetQuestions('Bridge')
  const duplicate = questions && questions.map((e: Questions) => ({ id: e.id, subcategory: e.subcategory }))
  const tabs: any = [];

  duplicate?.forEach(function (item) {
    const existing = tabs.filter(function (v: any) {
      return v.subcategory === item.subcategory;
    });
    if (!existing.length)
      tabs.push(item);
  });

  function activeTab(key: number) {
    if (active === key)
      return "text10"
    else if (String(active) === "0" && String(key) === "2")
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
        {tabs &&
          tabs.map((tab: any) => (
            <Text fontSize={14} fontWeight={500} lineHeight="21px" color={activeTab(tab?.id)} padding={10} onClick={() => { setActive(tab.id); setSubCategory(tab.subcategory) }} key={tab.id}>
              {tab.subcategory}
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
