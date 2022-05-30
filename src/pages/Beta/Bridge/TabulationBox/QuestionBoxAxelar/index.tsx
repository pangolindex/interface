import React, { useState } from 'react'
import { StyledLogo, SeparatorBorder, StyledLogoMinus } from '../../styleds'
import { Text } from '@pangolindex/components'
import MinusLogo from 'src/assets/images/minus.png'
import PlusLogo from 'src/assets/images/plus.png'
import { SubCategories, useSubBridgeCategories } from 'src/state/bridge/hooks'

export const AxelarBox = () => {
  const [active, setActive] = useState<number>()
  const [content, setContent] = useState<string>("")
  const { data: categories } = useSubBridgeCategories('Axelar')

  function activeLogo(index: number | undefined, key: number) {
    if (index === key) {
      return (<StyledLogoMinus src={ MinusLogo } size={ '20px'} height={'4px'} />)
    }
    else {
      return (<StyledLogo src={ PlusLogo } size={ '20px'} />)
    }
  }

function activeText(index: number | undefined, key: number) {
  if (index === key) {
    return (
      <Text fontSize= { 14} fontWeight = { 500} lineHeight="21px" color="text8" paddingX={33} >
        { content }
        </Text>
      )
  }
  else {
    return (
      <></>
    )
  }
}

function deactivateText(key: number) {
  if (active === key) {
    setActive(undefined)
  }
}

return (
  <>
    {categories &&
      categories.map((e: SubCategories) => (
        <div key={e.id} onClick={() => { setActive(e.id); setContent(e.content); deactivateText(e.id) }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {activeLogo(active, e?.id)}
            <Text fontSize={24} fontWeight={500} lineHeight="36px" color="text10">
              {e.title}
            </Text>
          </span>
          {activeText(active, e?.id)}
          <span style={{ padding: '20px' }}></span>
          <SeparatorBorder />
        </div>
      ))
    }
  </>
)
}