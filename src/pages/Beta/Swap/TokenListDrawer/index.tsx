import React, { useMemo, useState, useCallback } from 'react'
import ReactGA from 'react-ga'
import { Box, TextInput, Text, Button } from '@pangolindex/components'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from 'src/state'
import { useIsSelectedAEBTokenList } from 'src/state/lists/hooks'
import { DeprecatedWarning } from 'src/components/Warning'
import Drawer from 'src/components/Drawer'
import TokenListRow from './TokenListRow'
import { Warning, List, AddInputWrapper } from './styled'
import Scrollbars from 'react-custom-scrollbars'
import { useTranslation } from 'react-i18next'
import { useFetchListCallback } from 'src/hooks/useFetchListCallback'
import { removeList } from 'src/state/lists/actions'
import uriToHttp from 'src/utils/uriToHttp'
import { parseENSAddress } from 'src/utils/parseENSAddress'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const TokenListDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const [listUrlInput, setListUrlInput] = useState<string>('')
  const dispatch = useDispatch<AppDispatch>()
  const { t } = useTranslation()
  const lists = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)

  const adding = Boolean(lists[listUrlInput]?.loadingRequestId)
  const [addError, setAddError] = useState<string | null>(null)

  const fetchList = useFetchListCallback()

  const handleAddList = useCallback(() => {
    if (adding) return
    setAddError(null)
    fetchList(listUrlInput)
      .then(() => {
        setListUrlInput('')
        ReactGA.event({
          category: 'Lists',
          action: 'Add List',
          label: listUrlInput
        })
      })
      .catch(error => {
        ReactGA.event({
          category: 'Lists',
          action: 'Add List Failed',
          label: listUrlInput
        })
        setAddError(error.message)
        dispatch(removeList(listUrlInput))
      })
  }, [adding, dispatch, fetchList, listUrlInput])

  const validUrl = useMemo(() => {
    return uriToHttp(listUrlInput).length > 0 || Boolean(parseENSAddress(listUrlInput))
  }, [listUrlInput])

  const handleEnterKey = useCallback(
    e => {
      if (validUrl && e.key === 'Enter') {
        handleAddList()
      }
    },
    [handleAddList, validUrl]
  )

  const sortedLists = useMemo(() => {
    const listUrls = Object.keys(lists)
    return listUrls
      .filter(listUrl => {
        return Boolean(lists[listUrl].current)
      })
      .sort((u1, u2) => {
        const { current: l1 } = lists[u1]
        const { current: l2 } = lists[u2]
        if (l1 && l2) {
          return l1.name.toLowerCase() < l2.name.toLowerCase()
            ? -1
            : l1.name.toLowerCase() === l2.name.toLowerCase()
            ? 0
            : 1
        }
        if (l1) return -1
        if (l2) return 1
        return 0
      })
  }, [lists])

  const isAEBTokenList = useIsSelectedAEBTokenList()

  return (
    <Drawer title="Manage Lists" isOpen={isOpen} onClose={onClose}>
      {/* Render Search Token Input */}
      <Box padding="0px 10px">
        <AddInputWrapper>
          <TextInput
            placeholder={t('searchModal.httpsPlaceholder')}
            onChange={(value: any) => {
              setListUrlInput(value as string)
              setAddError(null)
            }}
            onKeyDown={handleEnterKey}
            value={listUrlInput}
          />
          <Button variant="outline" padding={'0px'} isDisabled={!validUrl} onClick={handleAddList} height="50px">
            Add
          </Button>
        </AddInputWrapper>

        {addError ? (
          <Text title={addError} color="red2" fontSize={12}>
            {addError}
          </Text>
        ) : null}
      </Box>
      <Scrollbars>
        {isAEBTokenList && (
          <Warning>
            <DeprecatedWarning />
          </Warning>
        )}
        <List>
          {sortedLists.map(url => (
            <TokenListRow listUrl={url} key={url} />
          ))}
        </List>
      </Scrollbars>
    </Drawer>
  )
}
export default TokenListDrawer
