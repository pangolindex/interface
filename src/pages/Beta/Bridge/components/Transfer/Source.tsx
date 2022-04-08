import { CHAIN_ID_BSC, CHAIN_ID_ETH } from '@certusone/wormhole-sdk'
import { getAddress } from '@ethersproject/address'
import React, { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import useIsWalletReady from 'src/hooks/bridgeHooks/useIsWalletReady'
import {
  selectTransferAmount,
  selectTransferIsSourceComplete,
  selectTransferShouldLockFields,
  selectTransferSourceBalanceString,
  selectTransferSourceChain,
  selectTransferSourceError,
  selectTransferSourceParsedTokenAccount,
  selectTransferTargetChain
} from 'src/store/selectors'
import { incrementStep, setAmount, setSourceChain, setTargetChain } from 'src/store/transferSlice'
import { BSC_MIGRATION_ASSET_MAP, CHAINS, ETH_MIGRATION_ASSET_MAP } from 'src/utils/bridgeUtils/consts'
import ButtonWithLoader from '../ButtonWithLoader'
import ChainSelect from '../ChainSelect'
import ChainSelectArrow from '../ChainSelectArrow'
import KeyAndBalance from '../KeyAndBalance'
import LowBalanceWarning from '../LowBalanceWarning'
import NumberTextField from '../NumberTextField'
import { TokenSelector } from '../TokenSelectors/SourceTokenSelector'
import SourceAssetWarning from './SourceAssetWarning'
import { BETA_MENU_LINK } from 'src/constants'
import { Text, Button } from '@pangolindex/components'


function Source() {
  const dispatch = useDispatch()
  const history = useHistory()
  const sourceChain = useSelector(selectTransferSourceChain)
  const targetChain = useSelector(selectTransferTargetChain)
  const targetChainOptions = useMemo(() => CHAINS.filter(c => c.id !== sourceChain), [sourceChain])
  const parsedTokenAccount = useSelector(selectTransferSourceParsedTokenAccount)
  const hasParsedTokenAccount = !!parsedTokenAccount
  const isEthereumMigration =
    sourceChain === CHAIN_ID_ETH &&
    !!parsedTokenAccount &&
    !!ETH_MIGRATION_ASSET_MAP.get(getAddress(parsedTokenAccount.mintKey))
  const isBscMigration =
    sourceChain === CHAIN_ID_BSC &&
    !!parsedTokenAccount &&
    !!BSC_MIGRATION_ASSET_MAP.get(getAddress(parsedTokenAccount.mintKey))
  const isMigrationAsset = isEthereumMigration || isBscMigration
  const uiAmountString = useSelector(selectTransferSourceBalanceString)
  const amount = useSelector(selectTransferAmount)
  const error = useSelector(selectTransferSourceError)
  const isSourceComplete = useSelector(selectTransferIsSourceComplete)
  const shouldLockFields = useSelector(selectTransferShouldLockFields)
  const { isReady, statusMessage } = useIsWalletReady(sourceChain)
  const handleMigrationClick = useCallback(() => {
    if (sourceChain === CHAIN_ID_ETH) {
      history.push(`/beta/bridge/migration/Ethereum/${parsedTokenAccount?.mintKey}`)
    }
  }, [history, parsedTokenAccount, sourceChain])
  const handleSourceChange = useCallback(
    event => {
      dispatch(setSourceChain(event.target.value))
    },
    [dispatch]
  )
  const handleTargetChange = useCallback(
    event => {
      dispatch(setTargetChain(event.target.value))
    },
    [dispatch]
  )
  const handleAmountChange = useCallback(
    event => {
      dispatch(setAmount(event.target.value))
    },
    [dispatch]
  )
  const handleMaxClick = useCallback(() => {
    if (uiAmountString) {
      dispatch(setAmount(uiAmountString))
    }
  }, [dispatch, uiAmountString])
  const handleNextClick = useCallback(() => {
    dispatch(incrementStep())
  }, [dispatch])

  return (
    <>
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text fontSize={13} fontWeight={500} lineHeight="12px" color="text10">
            Select tokens to send through the Portal.
          </Text>
          <div style={{ flexGrow: 1 }} />
          <div>
            <Button
              variant="primary"
              href={`#${BETA_MENU_LINK.TokenOriginVerifier}`}
              height={36}
              padding="4px 6px"
              as="a"
              target="">
                Verify
            </Button>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Text fontSize={17} fontWeight={500} lineHeight="12px" color="text10" paddingTop="5px" paddingBottom="5px">
          Origin
        </Text>
        <div style={{
          alignItems: 'center',
          width: '100%',
          fontSize: '20px',
          fontWeight: 500,
          outline: 'none',
          cursor: 'pointer',
          userSelect: 'none',
          border: 'none',
          backgroundColor: '#1c1c1c',
          marginTop: '5px',
          borderRadius: '8px'
          }}>
          <ChainSelect
            select
            variant="outlined"
            fullWidth
            value={sourceChain}
            onChange={handleSourceChange}
            disabled={shouldLockFields}
            chains={CHAINS}
          />
        </div>
        <div style={{position: 'relative', top: '12px'}}>
          <ChainSelectArrow
            onClick={() => {
              dispatch(setSourceChain(targetChain))
            }}
            disabled={shouldLockFields}
          />
        </div>
        <Text fontSize={17} fontWeight={500} lineHeight="12px" color="text10" paddingTop="10px" paddingBottom="5px">
          Destination
        </Text>
        <div style={{
          alignItems: 'center',
          width: '100%',
          fontSize: '20px',
          fontWeight: 500,
          outline: 'none',
          cursor: 'pointer',
          userSelect: 'none',
          border: 'none',
          backgroundColor: '#1c1c1c',
          marginTop: '5px',
          borderRadius: '8px'
          }}>
          <ChainSelect
            variant="outlined"
            select
            fullWidth
            value={targetChain}
            onChange={handleTargetChange}
            disabled={shouldLockFields}
            chains={targetChainOptions}
          />
        </div>
      </div>
      <KeyAndBalance chainId={sourceChain} />
      {isReady || uiAmountString ? (
        <div style={{marginTop: "20px"}}>
          <TokenSelector disabled={shouldLockFields} />
        </div>
      ) : null}
      {isMigrationAsset ? (
        <Button variant="primary" onClick={handleMigrationClick}>
          Go to Migration Page
        </Button>
      ) : (
        <>
          <LowBalanceWarning chainId={sourceChain} />
          <SourceAssetWarning sourceChain={sourceChain} sourceAsset={parsedTokenAccount?.mintKey} />
          {hasParsedTokenAccount ? (
            <NumberTextField
              variant="outlined"
              label="Amount"
              fullWidth
              value={amount}
              onChange={handleAmountChange}
              disabled={shouldLockFields}
              onMaxClick={uiAmountString && !parsedTokenAccount.isNativeAsset ? handleMaxClick : undefined}
              style={{ backgroundColor: 'white', marginTop: "20px" }}
            />
          ) : null}
          <ButtonWithLoader
            disabled={!isSourceComplete}
            onClick={handleNextClick}
            showLoader={false}
            error={statusMessage || error}
          >
            Next
          </ButtonWithLoader>
        </>
      )}
    </>
  )
}

export default Source
