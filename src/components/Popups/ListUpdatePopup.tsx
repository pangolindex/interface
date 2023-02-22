import { diffTokenLists, TokenList } from '@pangolindex/token-lists'
import React, { useCallback, useMemo } from 'react'
import { Text } from 'rebass'
import { useDispatch } from '../../state'
import { useRemovePopup, useTranslation, listVersionLabel } from '@pangolindex/components'
import { acceptListUpdate } from '../../state/lists/actions'
import { TYPE } from '../../theme'
import { ButtonSecondary } from '../Button'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'
import styled from 'styled-components'

const PopupUnorderedList = styled.ul`
  overflow-y: auto;
  max-height: 40vh;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-height: 15vh;
  `};
`

export default function ListUpdatePopup({
  popKey,
  listUrl,
  oldList,
  newList,
  auto
}: {
  popKey: string
  listUrl: string
  oldList: TokenList
  newList: TokenList
  auto: boolean
}) {
  const removePopup = useRemovePopup()
  const removeThisPopup = useCallback(() => removePopup(popKey), [popKey, removePopup])
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const handleAcceptUpdate = useCallback(() => {
    if (auto) return
    dispatch(acceptListUpdate(listUrl))
    removeThisPopup()
  }, [auto, dispatch, listUrl, removeThisPopup])

  const { added: tokensAdded, changed: tokensChanged, removed: tokensRemoved } = useMemo(() => {
    return diffTokenLists(oldList.tokens, newList.tokens)
  }, [newList.tokens, oldList.tokens])
  const numTokensChanged = useMemo(
    () =>
      Object.keys(tokensChanged).reduce((memo, chainId: any) => memo + Object.keys(tokensChanged[chainId]).length, 0),
    [tokensChanged]
  )

  return (
    <AutoRow>
      <AutoColumn style={{ flex: '1' }} gap="8px">
        {auto ? (
          <TYPE.body fontWeight={500}>
            {t('popups.tokenListUpdated', { oldList: oldList.name })}{' '}
            <strong>{listVersionLabel(newList.version)}</strong>.
          </TYPE.body>
        ) : (
          <>
            <div>
              <Text>
                {t('popups.updateAvailable', { oldList: oldList.name })} ({listVersionLabel(oldList.version)} to{' '}
                {listVersionLabel(newList.version)}).
              </Text>
              <PopupUnorderedList>
                {tokensAdded.length > 0 ? (
                  <li>
                    {tokensAdded.map((token, i) => (
                      <React.Fragment key={`${token.chainId}-${token.address}`}>
                        <strong title={token.address}>{token.symbol}</strong>
                        {i === tokensAdded.length - 1 ? null : ', '}
                      </React.Fragment>
                    ))}{' '}
                    {t('popups.added')}
                  </li>
                ) : null}
                {tokensRemoved.length > 0 ? (
                  <li>
                    {tokensRemoved.map((token, i) => (
                      <React.Fragment key={`${token.chainId}-${token.address}`}>
                        <strong title={token.address}>{token.symbol}</strong>
                        {i === tokensRemoved.length - 1 ? null : ', '}
                      </React.Fragment>
                    ))}{' '}
                    {t('popups.removed')}
                  </li>
                ) : null}
                {numTokensChanged > 0 ? (
                  <li>
                    {numTokensChanged} {t('popups.tokensUpdated')}
                  </li>
                ) : null}
              </PopupUnorderedList>
            </div>
            <AutoRow>
              <div style={{ flexGrow: 1, marginRight: 12 }}>
                <ButtonSecondary onClick={handleAcceptUpdate}>{t('popups.acceptUpdate')}</ButtonSecondary>
              </div>
              <div style={{ flexGrow: 1 }}>
                <ButtonSecondary onClick={removeThisPopup}>{t('popups.dismiss')}</ButtonSecondary>
              </div>
            </AutoRow>
          </>
        )}
      </AutoColumn>
    </AutoRow>
  )
}
