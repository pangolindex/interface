import React from "react";
import {
  ChainId,
  CHAIN_ID_SOLANA,
  CHAIN_ID_TERRA,
  isEVMChain,
  nativeToHexString,
} from "@certusone/wormhole-sdk";
import {
  Card,
  CircularProgress,
  Container,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { useCallback, useMemo, useState } from "react";
import { useBetaContext } from "src/contexts/BetaContext";
import useFetchForeignAsset, {
  ForeignAssetInfo,
} from "src/hooks/bridgeHooks/useFetchForeignAsset";
import useIsWalletReady from "src/hooks/bridgeHooks/useIsWalletReady";
import useMetadata from "src/hooks/bridgeHooks/useMetadata";
import useOriginalAsset, { OriginalAssetInfo } from "src/hooks/bridgeHooks/useOriginalAsset";
import { COLORS } from "../muiTheme";
import { BETA_CHAINS, CHAINS, CHAINS_BY_ID } from "src/utils/bridgeUtils/consts";
import HeaderText from "./HeaderText";
import KeyAndBalance from "./KeyAndBalance";
import SmartAddress from "./SmartAddress";
import { RegisterNowButtonCore } from "src/pages/Beta/Bridge/components/Transfer/RegisterNowButton";
import { Text } from '@pangolindex/components'

const useStyles = makeStyles((theme) => ({
  flexBox: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    "& > *": {
      margin: theme.spacing(2),
    },
  },
  mainCard: {
    padding: "32px 32px 16px",
    backgroundColor: COLORS.whiteWithTransparency,
  },
  spacer: {
    height: theme.spacing(3),
  },
  centered: {
    textAlign: "center",
    paddingBottom: "20px",
    paddingTop: "20px",

  },
  arrowIcon: {
    margin: "0 auto",
    fontSize: "70px",
  },
  resultContainer: {
    margin: theme.spacing(2),
  },
}));

function PrimaryAssetInfomation({
  lookupChain,
  lookupAsset,
  originChain,
  originAsset,
  showLoader,
}: {
  lookupChain: ChainId;
  lookupAsset: string;
  originChain: ChainId;
  originAsset: string;
  showLoader: boolean;
}) {
  const classes = useStyles();
  const tokenArray = useMemo(() => [originAsset], [originAsset]);
  const metadata = useMetadata(originChain, tokenArray);
  const nativeContent = (
    <div>
      <Typography style={{color: 'white'}}>{`This is not a Wormhole wrapped token.`}</Typography>
    </div>
  );
  const wrapped = (
    <div>
      <Typography style={{color: 'white'}}>{`This is wrapped by Wormhole! Here is the original token: `}</Typography>
      <div className={classes.flexBox}>
        <Typography style={{color: 'white'}}>{`Chain: ${CHAINS_BY_ID[originChain].name}`}</Typography>
        <div>
          <Typography style={{color: 'white'}} component="div">
            {"Token: "}
            <SmartAddress
              address={originAsset}
              chainId={originChain}
              symbol={metadata.data?.get(originAsset)?.symbol}
              tokenName={metadata.data?.get(originAsset)?.tokenName}
            />
          </Typography>
        </div>
      </div>
    </div>
  );
  return lookupChain === originChain ? nativeContent : wrapped;
}

function SecondaryAssetInformation({
  chainId,
  foreignAssetInfo,
  originAssetInfo,
}: {
  chainId: ChainId;
  foreignAssetInfo?: ForeignAssetInfo;
  originAssetInfo?: OriginalAssetInfo;
}) {
  const classes = useStyles();
  const tokenArray: string[] = useMemo(() => {
    //Saved to a variable to help typescript cope
    const originAddress = originAssetInfo?.originAddress;
    return originAddress && chainId === originAssetInfo?.originChain
      ? [originAddress]
      : foreignAssetInfo?.address
      ? [foreignAssetInfo?.address]
      : [];
  }, [foreignAssetInfo, originAssetInfo, chainId]);
  const metadata = useMetadata(chainId, tokenArray);
  //TODO when this is the origin chain
  return !originAssetInfo ? null : chainId === originAssetInfo.originChain ? (
    <div>
      <Typography style={{color: 'white'}}>{`Transferring to ${CHAINS_BY_ID[chainId].name} will unwrap the token:`}</Typography>
      <div className={classes.resultContainer}>
        <SmartAddress
          chainId={chainId}
          address={originAssetInfo.originAddress || undefined}
          symbol={
            metadata.data?.get(originAssetInfo.originAddress || "")?.symbol ||
            undefined
          }
          tokenName={
            metadata.data?.get(originAssetInfo.originAddress || "")
              ?.tokenName || undefined
          }
        />
      </div>
    </div>
  ) : !foreignAssetInfo ? null : foreignAssetInfo.doesExist === false ? (
    <div>
      <Typography style={{color: 'white'}}>{`This token has not yet been registered on ${CHAINS_BY_ID[chainId].name}`}</Typography>
      <RegisterNowButtonCore
        originChain={originAssetInfo?.originChain || undefined}
        originAsset={
          nativeToHexString(
            originAssetInfo?.originAddress || undefined,
            originAssetInfo?.originChain // this should exist
          ) || undefined
        }
        targetChain={chainId}
      />
    </div>
  ) : (
    <div>
      <Typography style={{color: 'white'}}>When bridged, this asset becomes: </Typography>
      <div className={classes.resultContainer}>
        <SmartAddress
          chainId={chainId}
          address={foreignAssetInfo.address || undefined}
          symbol={
            metadata.data?.get(foreignAssetInfo.address || "")?.symbol ||
            undefined
          }
          tokenName={
            metadata.data?.get(foreignAssetInfo.address || "")?.tokenName ||
            undefined
          }
        />
      </div>
    </div>
  );
}

export default function TokenOriginVerifier() {
  const classes = useStyles();
  const isBeta = useBetaContext();

  const [primaryLookupChain, setPrimaryLookupChain] = useState(CHAIN_ID_SOLANA);
  const [primaryLookupAsset, setPrimaryLookupAsset] = useState("");

  const [secondaryLookupChain, setSecondaryLookupChain] =
    useState(CHAIN_ID_TERRA);

  const primaryLookupChainOptions = useMemo(
    () => (isBeta ? CHAINS.filter((x) => !BETA_CHAINS.includes(x.id)) : CHAINS),
    [isBeta]
  );
  const secondaryLookupChainOptions = useMemo(
    () =>
      isBeta
        ? CHAINS.filter(
            (x) => !BETA_CHAINS.includes(x.id) && x.id !== primaryLookupChain
          )
        : CHAINS.filter((x) => x.id !== primaryLookupChain),
    [isBeta, primaryLookupChain]
  );

  const handlePrimaryLookupChainChange = useCallback(
    (e) => {
      setPrimaryLookupChain(e.target.value);
      if (secondaryLookupChain === e.target.value) {
        setSecondaryLookupChain(
          e.target.value === CHAIN_ID_SOLANA ? CHAIN_ID_TERRA : CHAIN_ID_SOLANA
        );
      }
      setPrimaryLookupAsset("");
    },
    [secondaryLookupChain]
  );
  const handleSecondaryLookupChainChange = useCallback((e) => {
    setSecondaryLookupChain(e.target.value);
  }, []);
  const handlePrimaryLookupAssetChange = useCallback((event) => {
    setPrimaryLookupAsset(event.target.value);
  }, []);

  const originInfo = useOriginalAsset(
    primaryLookupChain,
    primaryLookupAsset,
    false
  );
  const foreignAssetInfo = useFetchForeignAsset(
    originInfo.data?.originChain || 1,
    originInfo.data?.originAddress || "",
    secondaryLookupChain
  );

  const primaryWalletIsActive = !originInfo.data;
  const secondaryWalletIsActive = !primaryWalletIsActive;

  const primaryWallet = useIsWalletReady(
    primaryLookupChain,
    primaryWalletIsActive
  );
  const secondaryWallet = useIsWalletReady(
    secondaryLookupChain,
    secondaryWalletIsActive
  );

  const primaryWalletError =
    isEVMChain(primaryLookupChain) &&
    primaryLookupAsset &&
    !originInfo.data &&
    !originInfo.error &&
    (!primaryWallet.isReady ? primaryWallet.statusMessage : "");
  const originError = originInfo.error;
  const primaryError = primaryWalletError || originError;

  const secondaryWalletError =
    isEVMChain(secondaryLookupChain) &&
    originInfo.data?.originAddress &&
    originInfo.data?.originChain &&
    !foreignAssetInfo.data &&
    (!secondaryWallet.isReady ? secondaryWallet.statusMessage : "");
  const foreignError = foreignAssetInfo.error;
  const secondaryError = secondaryWalletError || foreignError;

  const primaryContent = (
    <>
      <Text fontSize={30} fontWeight={500} lineHeight="30px" color="text10">Source Information</Text>
      <Text fontSize={15} fontWeight={500} lineHeight="30px" color="text10">
        Enter a token from any supported chain to get started.
      </Text>
      <div className={classes.spacer} />
      <TextField
        select
        variant="outlined"
        label="Chain"
        value={primaryLookupChain}
        onChange={handlePrimaryLookupChainChange}
        fullWidth
        margin="normal"
        style={{backgroundColor: 'white'}}
      >
        {primaryLookupChainOptions.map(({ id, name }) => (
          <MenuItem key={id} value={id}>
            {name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        variant="outlined"
        margin="normal"
        label="Paste an address"
        value={primaryLookupAsset}
        onChange={handlePrimaryLookupAssetChange}
        style={{backgroundColor: 'white'}}
      />
      <div className={classes.centered}>
        {isEVMChain(primaryLookupChain) ? (
          <KeyAndBalance chainId={primaryLookupChain} />
        ) : null}
        {primaryError ? (
          <Typography color="error">{primaryError}</Typography>
        ) : null}
        <div className={classes.spacer} />
        {originInfo.isFetching ? (
          <CircularProgress />
        ) : originInfo.data?.originChain && originInfo.data.originAddress ? (
          <PrimaryAssetInfomation
            lookupAsset={primaryLookupAsset}
            lookupChain={primaryLookupChain}
            originChain={originInfo.data.originChain}
            originAsset={originInfo.data.originAddress}
            showLoader={originInfo.isFetching}
          />
        ) : null}
      </div>
    </>
  );

  const secondaryContent = originInfo.data ? (
    <>
      <Typography style={{color: 'white'}} variant="h5">Bridge Results</Typography>
      <Typography style={{color: 'white'}} variant="body1" color="textSecondary">
        Select a chain to see the result of bridging this token.
      </Typography>
      <div className={classes.spacer} />
      <TextField
        select
        variant="outlined"
        label="Other Chain"
        value={secondaryLookupChain}
        onChange={handleSecondaryLookupChainChange}
        fullWidth
        margin="normal"
        style={{color: 'white'}}
      >
        {secondaryLookupChainOptions.map(({ id, name }) => (
          <MenuItem key={id} value={id}>
            {name}
          </MenuItem>
        ))}
      </TextField>
      <div className={classes.centered}>
        {isEVMChain(secondaryLookupChain) ? (
          <KeyAndBalance chainId={secondaryLookupChain} />
        ) : null}
        {secondaryError ? (
          <Typography style={{color: 'white'}} color="error">{secondaryError}</Typography>
        ) : null}
        <div className={classes.spacer} />
        {foreignAssetInfo.isFetching ? (
          <CircularProgress />
        ) : originInfo.data?.originChain && originInfo.data.originAddress ? (
          <SecondaryAssetInformation
            foreignAssetInfo={foreignAssetInfo.data || undefined}
            originAssetInfo={originInfo.data || undefined}
            chainId={secondaryLookupChain}
          />
        ) : null}
      </div>
    </>
  ) : null;

  const content = (
    <div>
      <div className={classes.centered}>
      <Text fontSize={40} fontWeight={500} lineHeight="30px" color="text10">Token Origin Verifier</Text>
      </div>
      <Container maxWidth="sm">
        <Card className={classes.mainCard}>{primaryContent}</Card>
        {secondaryContent ? (
          <>
            <div className={classes.centered}>
              <ArrowDropDownIcon className={classes.arrowIcon} />
            </div>
            <Card className={classes.mainCard}>{secondaryContent}</Card>
          </>
        ) : null}
      </Container>
    </div>
  );

  return content;
}
