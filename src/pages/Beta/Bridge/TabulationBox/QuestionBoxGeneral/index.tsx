import React, { useState } from 'react'
import { StyledLogo, SeparatorBorder, StyledLogoMinus } from '../../styleds'
import { Text } from '@pangolindex/components'
import MinusLogo from 'src/assets/images/minus.png'
import PlusLogo from 'src/assets/images/plus.png'
import { SubCategories, useSubBridgeCategories } from 'src/state/bridge/hooks'

type ISubCategory = {
  subcategory: string
}

export const GeneralBox: React.FC<ISubCategory> = ({ subcategory }) => {
  const [active, setActive] = useState<number>()
  const [content, setContent] = useState<string>('')
  const { data: categories } = useSubBridgeCategories(subcategory)

  function activeLogo(key: number) {
    if (active === key) return <StyledLogoMinus src={MinusLogo} size={'20px'} height={'4px'} />
    else return <StyledLogo src={PlusLogo} size={'20px'} />
  }

  function activeText(key: number) {
    if (active === key) {
      return (
        <Text fontSize={14} fontWeight={500} lineHeight="21px" color="text8" paddingX={31}>
          {content}
        </Text>
      )
    } else {
      return <></>
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
          <div
            key={e.id}
            onClick={() => {
              setActive(e.id)
              setContent(e.content)
              deactivateText(e.id)
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {activeLogo(e?.id)}
              <Text fontSize={24} fontWeight={500} lineHeight="36px" color="text10">
                {e.title}
              </Text>
            </span>
            {activeText(e?.id)}
            <span style={{ padding: '20px' }}></span>
            <SeparatorBorder />
          </div>
        ))}
    </>
  )
}
