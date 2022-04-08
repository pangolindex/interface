import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ChainId } from '@certusone/wormhole-sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { createStyles, makeStyles } from '@material-ui/core'
import { useSelector } from 'react-redux'
import useMarketsMap from 'src/hooks/bridgeHooks/useMarketsMap'
import { NFTParsedTokenAccount } from 'src/store/nftSlice'
import { selectTransferTargetChain } from 'src/store/selectors'
import { AVAILABLE_MARKETS_URL, CHAINS_BY_ID } from 'src/utils/bridgeUtils/consts'
import NFTViewer from './NFTViewer'
import { Text, Button } from '@pangolindex/components'
import Modal from 'src/components/Modal'
import Loader from 'src/components/Modal'
import ReloadIcon from 'src/assets/images/refresh.png'
import { SearchInput, Separator } from '../../styleds'

const useStyles = makeStyles(theme =>
  createStyles({
    tokenOverviewContainer: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      '& div': {
        margin: theme.spacing(1),
        flexBasis: '25%',
        '&$tokenImageContainer': {
          maxWidth: 40
        },
        '&$tokenMarketsList': {
          marginTop: theme.spacing(-0.5),
          marginLeft: 0,
          flexBasis: '100%'
        },
        '&:last-child': {
          textAlign: 'right'
        },
        flexShrink: 1
      },
      flexWrap: 'wrap'
    },
    tokenMarketsList: {
      order: 1,
      textAlign: 'left',
      width: '100%',
      '& > .MuiButton-root': {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1)
      }
    },
    migrationAlert: {
      backgroundColor: 'black',

      width: '100%',
      '& .MuiAlert-message': {
        width: '100%'
      }
    },
  })
)

export const balancePretty = (uiString: string) => {
  const numberString = uiString.split('.')[0]
  const bignum = BigNumber.from(numberString)
  if (bignum.gte(1000000)) {
    return numberString.substring(0, numberString.length - 6) + ' M'
  } else if (uiString.length > 8) {
    return uiString.substr(0, 8)
  } else {
    return uiString
  }
}

const noClickThrough = (e: any) => {
  e.stopPropagation()
}

export const BasicAccountRender = (
  account: MarketParsedTokenAccount,
  isMigrationEligible: (address: string) => boolean,
  nft: boolean,
  displayBalance?: (account: NFTParsedTokenAccount) => boolean
) => {
  const { data: marketsData } = useMarketsMap(false)
  const classes = useStyles()
  const uri = nft ? account.image_256 : account.logo || account.uri
  const symbol = account.symbol || 'Unknown'
  const shouldDisplayBalance = !displayBalance || displayBalance(account)

  const tokenContent = (
    <div className={classes.tokenOverviewContainer}>
      {account.markets ? (
        <div className={classes.tokenMarketsList}>
          {account.markets.map(market =>
            marketsData?.markets?.[market] ? (
              <Button
                key={market}
                variant="primary"
                href={marketsData.markets[market].link}
                target="_blank"
                onClick={noClickThrough}
              >
                {marketsData.markets[market].name}
              </Button>
            ) : null
          )}
        </div>
      ) : null}
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: 40}}>
        {uri && <img alt="" style={{maxHeight: '2.5rem'}} src={uri} />}
      </div>
      <div>
        <Text fontSize={13} fontWeight={500} lineHeight="12px" color="primaryText1">
          {symbol}
        </Text>
      </div>
      <div>
        {
          <Text fontSize={13} fontWeight={500} lineHeight="12px" color="primaryText1">
            {account.isNativeAsset ? 'Native' : ''}
          </Text>
        }
      </div>
      <div>
        {shouldDisplayBalance ? (
          <>
            <Text fontSize={13} fontWeight={500} lineHeight="12px" color="primaryText1">
              {'Balance'}
            </Text>
            <Text fontSize={13} fontWeight={500} lineHeight="12px" color="primaryText1">
              {balancePretty(account.uiAmountString)}
            </Text>
          </>
        ) : (
          <div />
        )}
      </div>
    </div>
  )

  const migrationRender = (
    <div className={classes.migrationAlert}>
      <div>
        <Text fontSize={13} fontWeight={500} lineHeight="12px" color="primaryText1">
          This is a legacy asset eligible for migration.
        </Text>
        <div>{tokenContent}</div>
      </div>
    </div>
  )

  return isMigrationEligible(account.mintKey) ? migrationRender : tokenContent
}

interface MarketParsedTokenAccount extends NFTParsedTokenAccount {
  markets?: string[]
}

export default function TokenPicker({
  value,
  options,
  RenderOption,
  onChange,
  isValidAddress,
  getAddress,
  disabled,
  resetAccounts,
  nft,
  chainId,
  error,
  showLoader,
  useTokenId
}: {
  value: NFTParsedTokenAccount | null
  options: NFTParsedTokenAccount[]
  RenderOption: ({ account }: { account: NFTParsedTokenAccount }) => JSX.Element
  onChange: (newValue: NFTParsedTokenAccount | null) => Promise<void>
  isValidAddress?: (address: string) => boolean
  getAddress?: (address: string, tokenId?: string) => Promise<NFTParsedTokenAccount>
  disabled: boolean
  resetAccounts: (() => void) | undefined
  nft: boolean
  chainId: ChainId
  error?: string
  showLoader?: boolean
  useTokenId?: boolean
}) {
  const [holderString, setHolderString] = useState('')
  const [tokenIdHolderString, setTokenIdHolderString] = useState('')
  const [loadingError, setLoadingError] = useState('')
  const [isLocalLoading, setLocalLoading] = useState(false)
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const [selectionError, setSelectionError] = useState('')

  const targetChain = useSelector(selectTransferTargetChain)
  const { data: marketsData } = useMarketsMap(true)

  const openDialog = useCallback(() => {
    setHolderString('')
    setSelectionError('')
    setDialogIsOpen(true)
  }, [])

  const closeDialog = useCallback(() => {
    setDialogIsOpen(false)
  }, [])

  const handleSelectOption = useCallback(
    async (option: NFTParsedTokenAccount) => {
      setSelectionError('')
      let newOption = null
      try {
        //Covalent balances tend to be stale, so we make an attempt to correct it at selection time.
        if (getAddress && !option.isNativeAsset) {
          newOption = await getAddress(option.mintKey, option.tokenId)
          newOption = {
            ...option,
            ...newOption,
            // keep logo and uri from covalent / market list / etc (otherwise would be overwritten by undefined)
            logo: option.logo || newOption.logo,
            uri: option.uri || newOption.uri
          } as NFTParsedTokenAccount
        } else {
          newOption = option
        }
        await onChange(newOption)
        closeDialog()
      } catch (e: any) {
        if (e.message?.includes('v1')) {
          setSelectionError(e.message)
        } else {
          setSelectionError(
            'Unable to retrieve required information about this token. Ensure your wallet is connected, then refresh the list.'
          )
        }
      }
    },
    [getAddress, onChange, closeDialog]
  )

  const resetAccountsWrapper = useCallback(() => {
    setHolderString('')
    setTokenIdHolderString('')
    setSelectionError('')
    resetAccounts && resetAccounts()
  }, [resetAccounts])

  const searchFilter = useCallback(
    (option: NFTParsedTokenAccount) => {
      if (!holderString) {
        return true
      }
      const optionString = (
        (option.publicKey || '') +
        ' ' +
        (option.mintKey || '') +
        ' ' +
        (option.symbol || '') +
        ' ' +
        (option.name || ' ')
      ).toLowerCase()
      const searchString = holderString.toLowerCase()
      return optionString.includes(searchString)
    },
    [holderString]
  )

  const marketChainTokens = marketsData?.tokens?.[chainId]
  const featuredMarkets = marketsData?.tokenMarkets?.[chainId]?.[targetChain]

  const featuredOptions = useMemo(() => {
    // only tokens have featured markets
    if (!nft && featuredMarkets) {
      const ownedMarketTokens = options
        .filter((option: NFTParsedTokenAccount) => featuredMarkets?.[option.mintKey])
        .map(
          option =>
            ({
              ...option,
              markets: featuredMarkets[option.mintKey].markets
            } as MarketParsedTokenAccount)
        )
      return [
        ...ownedMarketTokens,
        ...Object.keys(featuredMarkets)
          .filter(mintKey => !ownedMarketTokens.find(option => option.mintKey === mintKey))
          .map(
            mintKey =>
              ({
                amount: '0',
                decimals: 0,
                markets: featuredMarkets[mintKey].markets,
                mintKey,
                publicKey: '',
                uiAmount: 0,
                uiAmountString: '0', // if we can't look up by address, we can select the market that isn't in the list of holdings, but can't proceed since the balance will be 0
                symbol: marketChainTokens?.[mintKey]?.symbol,
                logo: marketChainTokens?.[mintKey]?.logo
              } as MarketParsedTokenAccount)
          )
      ].filter(searchFilter)
    }
    return []
  }, [nft, marketChainTokens, featuredMarkets, options, searchFilter])

  const nonFeaturedOptions = useMemo(() => {
    return options.filter(
      (option: NFTParsedTokenAccount) =>
        searchFilter(option) &&
        // only tokens have featured markets
        (nft || !featuredMarkets?.[option.mintKey])
    )
  }, [nft, options, featuredMarkets, searchFilter])

  const localFind = useCallback(
    (address: string, tokenIdHolderString: string) => {
      return options.find(x => x.mintKey === address && (!tokenIdHolderString || x.tokenId === tokenIdHolderString))
    },
    [options]
  )

  //This is the effect which allows pasting an address in directly
  useEffect(() => {
    if (!isValidAddress || !getAddress) {
      return
    }
    if (useTokenId && !tokenIdHolderString) {
      return
    }
    setLoadingError('')
    let cancelled = false
    if (isValidAddress(holderString)) {
      const option = localFind(holderString, tokenIdHolderString)
      if (option) {
        handleSelectOption(option)
        return () => {
          cancelled = true
        }
      }
      setLocalLoading(true)
      setLoadingError('')
      getAddress(holderString, useTokenId ? tokenIdHolderString : undefined).then(
        result => {
          if (!cancelled) {
            setLocalLoading(false)
            if (result) {
              handleSelectOption(result)
            }
          }
        },
        error => {
          if (!cancelled) {
            setLocalLoading(false)
            setLoadingError('Could not find the specified address.')
          }
        }
      )
    }
    return () => (cancelled = true)
  }, [holderString, isValidAddress, getAddress, handleSelectOption, localFind, tokenIdHolderString, useTokenId])

  //TODO reset button
  //TODO debounce & save hotloaded options as an option before automatically selecting
  //TODO sigfigs function on the balance strings

  const localLoader = (
    <div style={{ textAlign: "center" }}>
      {/* <CircularProgress /> */}
      <Loader
        isOpen={isLocalLoading}
        onDismiss={() => {
          !isLocalLoading
        }}
      />
      <Text fontSize={13} fontWeight={500} lineHeight="12px" color="primaryText1">
        {showLoader ? 'Loading available tokens' : 'Searching for results'}
      </Text>
    </div>
  )

  const displayLocalError = (
    <div style={{ textAlign: "center" }}>
      <Text fontSize={13} fontWeight={500} lineHeight="12px" color="primaryText1">
        {loadingError || selectionError}
      </Text>
    </div>
  )

  const handleSearch = useCallback(event => {
    setHolderString(event.target.value.trim().toLowerCase())
  }, [])

  const handleHolderString = useCallback(event => {
    setTokenIdHolderString(event.target.value.trim().toLowerCase())
  }, [])

  const dialog = (
    <Modal onDismiss={closeDialog} isOpen={dialogIsOpen} maxWidth={800}>
      <div style={{ backgroundColor: '#212427' }}>
        <div style={{ padding: '20px' }}>
          <Text fontSize={13} fontWeight={500} lineHeight="12px" color="text10">
            Refresh
          </Text>
          <div style={{flexGrow: 1}} />
          <div title="Reload tokens">
            <img src={ReloadIcon} style={{ width: '12px' }} onClick={resetAccountsWrapper} />
          </div>
        </div>
      </div>
      <div style={{ padding: '20px', overflowX: 'hidden', backgroundColor: '#1c1c1c' }}>
        <p style={{ backgroundColor: '#212427', color: 'white', padding: '5px' }}>
          You should always check for markets and liquidity before sending tokens.{' '}
          <a
            href={AVAILABLE_MARKETS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline', color: 'white' }}
          >
            Click here to see available markets for wrapped tokens.
          </a>
        </p>
        <SearchInput placeholder="Search name or paste address" value={holderString} onChange={handleSearch} />
        {useTokenId ? (
          <SearchInput placeholder="Token Id" value={tokenIdHolderString} onChange={handleHolderString} />
        ) : null}
        {isLocalLoading || showLoader ? (
          localLoader
        ) : loadingError || selectionError ? (
          displayLocalError
        ) : (
          <div style={{maxHeight: "60vh", height: "60vh", overflow: 'auto'}}>
            {nonFeaturedOptions.length ? (
              <>
                <Separator />
                <Text fontSize={13} fontWeight={500} lineHeight="12px" color="text5">
                  Other Assets
                </Text>
              </>
            ) : null}

            {nonFeaturedOptions.map(option => {
              return (
                <div
                  onClick={() => handleSelectOption(option)}
                  key={option.publicKey + option.mintKey + (option.tokenId || '')}
                  style={{cursor: "pointer"}}
                >
                  <RenderOption account={option} />
                </div>
              )
            })}
            {featuredOptions.length ? (
              <div style={{ paddingTop: '30px' }}>
                <Text fontSize={13} fontWeight={500} lineHeight="12px" color="primaryText1">
                  Featured {CHAINS_BY_ID[chainId].name} &gt; {CHAINS_BY_ID[targetChain].name} markets{' '}
                  <div
                    title={`Markets for these ${CHAINS_BY_ID[chainId].name} tokens exist for the corresponding tokens on ${CHAINS_BY_ID[targetChain].name}`}
                  ></div>
                </Text>
                {featuredOptions.map(option => {
                  return (
                    <div
                      onClick={() => handleSelectOption(option)}
                      key={option.publicKey + option.mintKey + (option.tokenId || '')}
                    >
                      <RenderOption account={option} />
                    </div>
                  )
                })}
              </div>
            ) : null}
            {featuredOptions.length || nonFeaturedOptions.length ? null : (
              <div style={{ textAlign: "center" }}>
                <Text fontSize={13} fontWeight={500} lineHeight="12px" color="text5">
                  No results found
                </Text>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )

  const selectionChip = (
    <div style={{textAlign: 'center',backgroundColor: '#212427',marginTop: "2vh", marginBottom: "2vh"}}>
      {value ? (
        <RenderOption account={value} />
      ) : (
        <Button onClick={openDialog} variant="outline">
          <Text fontSize={13} fontWeight={500} lineHeight="12px" color="text10">
            Select a token
          </Text>
        </Button>
      )}
    </div>
  )

  return (
    <>
      {dialog}
      {value && nft ? <NFTViewer value={value} chainId={chainId} /> : null}
      {selectionChip}
    </>
  )
}
