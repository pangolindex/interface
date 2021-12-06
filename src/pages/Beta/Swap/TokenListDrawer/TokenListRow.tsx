import { Text, Switch, Box } from '@pangolindex/components'
import React, { useCallback, useState, useRef } from 'react'
import ReactGA from 'react-ga'
import { useDispatch, useSelector } from 'react-redux'
import { ChevronDown } from 'react-feather'
import { usePopper } from 'react-popper'
import { AppState } from 'src/state'
import { useSelectedListUrl } from 'src/state/lists/hooks'
import { selectList, removeList } from 'src/state/lists/actions'
import TokenListOrigin from 'src/components/TokenListOrigin'
import useToggle from 'src/hooks/useToggle'
import { ListLogo, RowRoot, DownArrow, PopoverContainer, Separator, ViewLink } from './styled'
import { useOnClickOutside } from 'src/hooks/useOnClickOutside'
import listVersionLabel from 'src/utils/listVersionLabel'
import { useTranslation } from 'react-i18next'

interface Props {
  listUrl: string
}

const TokenListRow: React.FC<Props> = ({ listUrl }) => {
  const lists = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)
  const { current: list } = lists[listUrl]

  const { t } = useTranslation()

  const dispatch = useDispatch()
  const selectedListUrl = useSelectedListUrl()
  const isSelected = (selectedListUrl || []).includes(listUrl)

  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement>()
  const [popperElement, setPopperElement] = useState<HTMLDivElement>()

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'auto',
    strategy: 'fixed',
    modifiers: [{ name: 'offset', options: { offset: [8, 8] } }]
  })

  useOnClickOutside(node, open ? toggle : undefined)

  const selectThisList = useCallback(() => {
    ReactGA.event({
      category: 'Lists',
      action: 'Select List',
      label: listUrl
    })

    dispatch(selectList({ url: listUrl, shouldSelect: !isSelected }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isSelected, listUrl])

  const handleRemoveList = useCallback(() => {
    ReactGA.event({
      category: 'Lists',
      action: 'Start Remove List',
      label: listUrl
    })
    if (window.prompt(t('searchModal.confirmListRemovalPrompt')) === t('searchModal.remove')) {
      ReactGA.event({
        category: 'Lists',
        action: 'Confirm Remove List',
        label: listUrl
      })
      dispatch(removeList(listUrl))
    }
  }, [dispatch, removeList, listUrl, t])

  if (!list) return null

  return (
    <RowRoot>
      {list?.logoURI ? <ListLogo size={24} src={list?.logoURI} /> : <ListLogo as="div" size={24} />}
      <Box>
        <Text fontSize={16} color="text1" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {list?.name}
        </Text>
        <Text fontSize={12} color="text3" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} title={listUrl}>
          <TokenListOrigin listUrl={listUrl} />
        </Text>
      </Box>
      <Box ref={node as any}>
        <DownArrow ref={setReferenceElement as any} onClick={toggle}>
          <ChevronDown />
        </DownArrow>
        {open && (
          <PopoverContainer ref={setPopperElement as any} style={styles.popper} {...attributes.popper}>
            <div>{list && listVersionLabel(list.version)}</div>
            <Separator />
            <ViewLink
              fontSize={13}
              as="a"
              color="text1"
              href={`https://tokenlists.org/token-list?url=${listUrl}`}
              target="_blank"
            >
              {t('searchModal.viewList')}
            </ViewLink>
            <ViewLink fontSize={13} color="text1" onClick={handleRemoveList} disabled={Object.keys(lists).length === 1}>
              {t('searchModal.removeList')}
            </ViewLink>
          </PopoverContainer>
        )}
      </Box>
      <Switch checked={isSelected} onChange={() => selectThisList()} />
    </RowRoot>
  )
}

export default TokenListRow
