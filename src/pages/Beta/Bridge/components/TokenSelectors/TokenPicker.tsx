import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ChainId } from '@certusone/wormhole-sdk'
import { BigNumber } from '@ethersproject/bignumber'
import {
  // Button,
  CircularProgress,
  createStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  makeStyles,
  TextField,
  Tooltip,
  Typography
} from '@material-ui/core'
import { InfoOutlined, Launch } from '@material-ui/icons'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import RefreshIcon from '@material-ui/icons/Refresh'
import { Alert } from '@material-ui/lab'
import { useSelector } from 'react-redux'
import useMarketsMap from 'src/hooks/bridgeHooks/useMarketsMap'
import { NFTParsedTokenAccount } from 'src/store/nftSlice'
import { selectTransferTargetChain } from 'src/store/selectors'
import { AVAILABLE_MARKETS_URL, CHAINS_BY_ID } from 'src/utils/bridgeUtils/consts'
import NFTViewer from './NFTViewer'
import { Text, Button } from '@pangolindex/components'
import Modal from 'src/components/Modal'
import Loader from "src/components/Modal"
import ReloadIcon from "src/assets/images/refresh.png"
import { SearchInput } from "../../styleds"

const useStyles = makeStyles(theme =>
  createStyles({
    alignCenter: {
      textAlign: 'center'
    },
    optionContainer: {
      padding: 0
    },
    optionContent: {
      padding: theme.spacing(1)
    },
    tokenList: {
      maxHeight: theme.spacing(80), //TODO smarter
      height: theme.spacing(80),
      overflow: 'auto'
    },
    dialogContent: {
      overflowX: 'hidden',
      backgroundColor: '#1c1c1c'
    },
    dialogTitle: {
      backgroundColor: '#212427'
    },
    selectionButtonContainer: {
      //display: "flex",
      textAlign: 'center',
      backgroundColor: '#212427',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    },
    selectionButton: {
      maxWidth: '100%',
      width: theme.breakpoints.values.sm
    },
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
    tokenImageContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 40
    },
    tokenImage: {
      maxHeight: '2.5rem' //Eyeballing this based off the text size
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
    flexTitle: {
      padding: "30px"
    },
    grower: {
      flexGrow: 1
    },
    textFieldColor: {
      color: 'white'
    }
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
                // startIcon={<Launch />}
                href={marketsData.markets[market].link}
                target="_blank"
                // rel="noopener noreferrer"
                onClick={noClickThrough}
              >
                {marketsData.markets[market].name}
              </Button>
            ) : null
          )}
        </div>
      ) : null}
      <div className={classes.tokenImageContainer}>
        {uri && <img alt="" className={classes.tokenImage} src={uri} />}
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
  const classes = useStyles()
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
    <div className={classes.alignCenter}>
      {/* <CircularProgress /> */}
      <Loader isOpen={isLocalLoading} onDismiss={() => {!isLocalLoading}} />
      <Text fontSize={13} fontWeight={500} lineHeight="12px" color="primaryText1">
        {showLoader ? 'Loading available tokens' : 'Searching for results'}
      </Text>
    </div>
  )

  const displayLocalError = (
    <div className={classes.alignCenter}>
      <Text fontSize={13} fontWeight={500} lineHeight="12px" color="primaryText1">
        {loadingError || selectionError}
      </Text>
    </div>
  )

  const handleSearch = useCallback(event => {
    setHolderString(event.target.value.trim().toLowerCase())
  }, [])

  const dialog = (
    <Modal onDismiss={closeDialog} isOpen={dialogIsOpen} maxWidth={800}  >
      <div style={{backgroundColor: "#212427"}}>
        <div style={{padding: "20px"}}>
          <Text fontSize={13} fontWeight={500} lineHeight="12px" color="text10">
            Refresh
          </Text>
          <div className={classes.grower} />
          <Tooltip title="Reload tokens">
            <IconButton style={{ color: 'white' }} onClick={resetAccountsWrapper}>
              <img src={ReloadIcon} style={{width: "12px"}} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <DialogContent className={classes.dialogContent}>
        <p style={{ backgroundColor: '#212427', color: 'white', padding: "5px" }}>
          You should always check for markets and liquidity before sending tokens.{' '}
          <a href={AVAILABLE_MARKETS_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'white' }}>
            Click here to see available markets for wrapped tokens.
          </a>
        </p>
        {/* <TextField
          variant="outlined"
          label="Search name or paste address"
          value={holderString}
          onChange={event => setHolderString(event.target.value)}
          fullWidth
          margin="normal"
          // className={classes.textFieldColor}
          inputProps={{ className: classes.textFieldColor }}
          style={{ backgroundColor: 'white' }}
        /> */}
        {console.log('ye', holderString)}
        <SearchInput
                placeholder="Search name or paste address"
                value={holderString}
                onChange={handleSearch}
              />
        {/* <AddressInputPanel id="recipient" value={holderString} onChange={event => setHolderString(event.target.value)} /> */}
        {useTokenId ? (
          <TextField
            variant="outlined"
            label="Token Id"
            value={tokenIdHolderString}
            onChange={event => setTokenIdHolderString(event.target.value)}
            fullWidth
            margin="normal"
            style={{ color: 'white' }}
          />
        ) : null}
        {isLocalLoading || showLoader ? (
          localLoader
        ) : loadingError || selectionError ? (
          displayLocalError
        ) : (
          <List component="div" className={classes.tokenList}>
            {featuredOptions.length ? (
              <>
                <Text fontSize={13} fontWeight={500} lineHeight="12px" color="primaryText1">
                  Featured {CHAINS_BY_ID[chainId].name} &gt; {CHAINS_BY_ID[targetChain].name} markets{' '}
                  <Tooltip
                    title={`Markets for these ${CHAINS_BY_ID[chainId].name} tokens exist for the corresponding tokens on ${CHAINS_BY_ID[targetChain].name}`}
                  >
                    <InfoOutlined fontSize="small" style={{ verticalAlign: 'text-bottom' }} />
                  </Tooltip>
                </Text>
                {/* ATTENTION ICI */}
                {featuredOptions.map(option => {
                  return (
                    <ListItem
                      component="div"
                      button
                      onClick={() => handleSelectOption(option)}
                      key={option.publicKey + option.mintKey + (option.tokenId || '')}
                    >
                      <RenderOption account={option} />
                    </ListItem>
                  )
                })}
                {nonFeaturedOptions.length ? (
                  <>
                    <Divider style={{ marginTop: 8, marginBottom: 16 }} />
                    <Text fontSize={13} fontWeight={500} lineHeight="12px" color="text5">
                      Other Assets
                    </Text>
                  </>
                ) : null}
              </>
            ) : null}
            {nonFeaturedOptions.map(option => {
              return (
                <ListItem
                  component="div"
                  button
                  onClick={() => handleSelectOption(option)}
                  key={option.publicKey + option.mintKey + (option.tokenId || '')}
                >
                  <RenderOption account={option} />
                </ListItem>
              )
            })}
            {featuredOptions.length || nonFeaturedOptions.length ? null : (
              <div className={classes.alignCenter}>
                <Text fontSize={13} fontWeight={500} lineHeight="12px" color="text5">
                  No results found
                </Text>
              </div>
            )}
          </List>
        )}
      </DialogContent>
    </Modal>
  )

  const selectionChip = (
    <div className={classes.selectionButtonContainer}>
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
