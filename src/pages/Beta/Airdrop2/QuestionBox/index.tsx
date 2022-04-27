import React, { useState } from 'react'
import { Text } from '@pangolindex/components'
import { StyledLogo, QuestionBox } from '../styleds'
import PlusLogo from 'src/assets/images/plus.png'
import MinusLogo from 'src/assets/images/minus.png'

export const QuestionAnswer = () => {
  const [visible, setVisible] = useState<boolean>(false)

  var axios = require('axios')
  var data = JSON.stringify({
    query: `query getKnowledge($filter: kb_filter) {
      kb(filter: $filter) {
          id
          title
          content
      }
  }`,
    variables: { filter: { category: { _eq: 'Airdrop' } } }
  })

  var config = {
    method: 'post',
    url: 'https://p7gm7mqi.directus.app/graphql',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  }

  const [title, setTitle] = useState<String>('')
  const [content, setContent] = useState<String>('')

  axios(config).then(function(response: any) {
    setTitle(JSON.stringify(response.data.data.kb.map((e: any) => e.title)).replace(/[[\]"]/g, ''))
    setContent(JSON.stringify(response.data.data.kb.map((e: any) => e.content)).replace(/[[\]"]/g, ''))
  })

  return (
    <QuestionBox>
      <div onClick={() => setVisible(!visible)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
          {visible ? <img src={MinusLogo} alt="" /> : <StyledLogo src={PlusLogo} size={'20px'} />}
          <Text fontSize={24} fontWeight={700} lineHeight="36px" color="text10">
            {title}
          </Text>
        </div>
        {visible ? (
          <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text8" style={{ textAlign: 'justify' }}>
            {content}
          </Text>
        ) : (
          <></>
        )}
      </div>
    </QuestionBox>
  )
}
