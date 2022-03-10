import React, { useState } from 'react'
import { QuestionBox, TableContent, FullBox } from '../styleds'
import { GeneralBox } from './GeneralBox'
import { OtherQuestionBox } from './OtherQuestionBox'
import { BridgingBox } from './BridgingBox'
import { TrollFeeBox } from './TrollFeeBox'
import { TrollQuestionBox } from './TrollQuestionBox'
import { Text } from '@pangolindex/components'

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
        { general ? (
            <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text10" padding={10} onClick={showGeneral}>
                General
            </Text>
        ) : (
            <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text8" padding={10} onClick={showGeneral}>
                General
            </Text>
        )}
        { otherQuestion ? (
        <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text10" padding={10} onClick={showOtherQuestion}>
            Other Questions
        </Text>
        ) : (
        <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text8" padding={10} onClick={showOtherQuestion}>
            Other Questions
        </Text>
        )}

        { bridging ? (
        <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text10" padding={10} onClick={showBridging}>
            Bridging For Noobs
        </Text>
        ) : (
        <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text8" padding={10} onClick={showBridging}>
            Bridging For Noobs
        </Text>
        )}
        { trollQuestions ? (
        <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text10" padding={10} onClick={showTrollQuestions}>
            Troll Related Questions
        </Text>
        ) : (
        <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text8" padding={10} onClick={showTrollQuestions}>
            Troll Related Questions
        </Text>
        )}
        { trollFee ? (
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