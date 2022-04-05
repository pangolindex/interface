/* eslint-disable */
import {
  ChainId,
  CHAIN_ID_AVAX,
  CHAIN_ID_BSC,
  CHAIN_ID_ETH,
  CHAIN_ID_ETHEREUM_ROPSTEN,
  CHAIN_ID_FANTOM,
  CHAIN_ID_OASIS,
  CHAIN_ID_POLYGON,
  CHAIN_ID_TERRA,
  isEVMChain,
} from "@certusone/wormhole-sdk";
import axios from "axios";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Provider,
  useEthereumProvider,
} from "src/contexts/EthereumProviderContext";
import avaxIcon from "src/pages/Beta/Bridge/icons/avax.svg";
import bnbIcon from "src/pages/Beta/Bridge/icons/bnb.svg";
import ethIcon from "src/pages/Beta/Bridge/icons/eth.svg";
import fantomIcon from "src/pages/Beta/Bridge/icons/fantom.svg";
import oasisIcon from "src/pages/Beta/Bridge//icons/oasis-network-rose-logo.svg";
import polygonIcon from "src/pages/Beta/Bridge/icons/polygon.svg";
import {
  errorSourceParsedTokenAccounts as errorSourceParsedTokenAccountsNFT,
  fetchSourceParsedTokenAccounts as fetchSourceParsedTokenAccountsNFT,
  NFTParsedTokenAccount,
  receiveSourceParsedTokenAccounts as receiveSourceParsedTokenAccountsNFT,
  setSourceParsedTokenAccount as setSourceParsedTokenAccountNFT,
  setSourceParsedTokenAccounts as setSourceParsedTokenAccountsNFT,
  setSourceWalletAddress as setSourceWalletAddressNFT,
} from "src/store/nftSlice";
import {
  selectNFTSourceChain,
  selectNFTSourceParsedTokenAccounts,
  selectNFTSourceWalletAddress,
  selectSourceWalletAddress,
  selectTransferSourceChain,
  selectTransferSourceParsedTokenAccounts,
} from "src/store/selectors";
import {
  errorSourceParsedTokenAccounts,
  fetchSourceParsedTokenAccounts,
  ParsedTokenAccount,
  receiveSourceParsedTokenAccounts,
  setAmount,
  setSourceParsedTokenAccount,
  setSourceParsedTokenAccounts,
  setSourceWalletAddress,
} from "src/store/transferSlice";
import {
  COVALENT_GET_TOKENS_URL,
  logoOverrides,
  ROPSTEN_WETH_ADDRESS,
  ROPSTEN_WETH_DECIMALS,
  WAVAX_ADDRESS,
  WAVAX_DECIMALS,
  WBNB_ADDRESS,
  WBNB_DECIMALS,
  WETH_ADDRESS,
  WETH_DECIMALS,
  WFTM_ADDRESS,
  WFTM_DECIMALS,
  WMATIC_ADDRESS,
  WMATIC_DECIMALS,
  WROSE_ADDRESS,
  WROSE_DECIMALS,
} from "src/utils/bridgeUtils/consts";

export function createParsedTokenAccount(
  publicKey: string,
  mintKey: string,
  amount: string,
  decimals: number,
  uiAmount: number,
  uiAmountString: string,
  symbol?: string,
  name?: string,
  logo?: string,
  isNativeAsset?: boolean
): ParsedTokenAccount {
  return {
    publicKey: publicKey,
    mintKey: mintKey,
    amount,
    decimals,
    uiAmount,
    uiAmountString,
    symbol,
    name,
    logo,
    isNativeAsset,
  };
}

export function createNFTParsedTokenAccount(
  publicKey: string,
  mintKey: string,
  amount: string,
  decimals: number,
  uiAmount: number,
  uiAmountString: string,
  tokenId: string,
  symbol?: string,
  name?: string,
  uri?: string,
  animation_url?: string,
  external_url?: string,
  image?: string,
  image_256?: string,
  nftName?: string,
  description?: string
): NFTParsedTokenAccount {
  return {
    publicKey,
    mintKey,
    amount,
    decimals,
    uiAmount,
    uiAmountString,
    tokenId,
    uri,
    animation_url,
    external_url,
    image,
    image_256,
    symbol,
    name,
    nftName,
    description,
  };
}


const createParsedTokenAccountFromCovalent = (
  walletAddress: string,
  covalent: CovalentData
): ParsedTokenAccount => {
  return {
    publicKey: walletAddress,
    mintKey: covalent.contract_address,
    amount: covalent.balance,
    decimals: covalent.contract_decimals,
    uiAmount: Number(formatUnits(covalent.balance, covalent.contract_decimals)),
    uiAmountString: formatUnits(covalent.balance, covalent.contract_decimals),
    symbol: covalent.contract_ticker_symbol,
    name: covalent.contract_name,
    logo: logoOverrides.get(covalent.contract_address) || covalent.logo_url,
  };
};

const createNativeEthParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : provider.getBalance(signerAddress).then((balanceInWei) => {
        const balanceInEth = ethers.utils.formatEther(balanceInWei);
        return createParsedTokenAccount(
          signerAddress, //public key
          WETH_ADDRESS, //Mint key, On the other side this will be WETH, so this is hopefully a white lie.
          balanceInWei.toString(), //amount, in wei
          WETH_DECIMALS, //Luckily both ETH and WETH have 18 decimals, so this should not be an issue.
          parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
          balanceInEth.toString(), //This is the actual display field, which has full precision.
          "ETH", //A white lie for display purposes
          "Ethereum", //A white lie for display purposes
          ethIcon,
          true //isNativeAsset
        );
      });
};

const createNativeEthRopstenParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : provider.getBalance(signerAddress).then((balanceInWei) => {
        const balanceInEth = ethers.utils.formatEther(balanceInWei);
        return createParsedTokenAccount(
          signerAddress, //public key
          ROPSTEN_WETH_ADDRESS, //Mint key, On the other side this will be WETH, so this is hopefully a white lie.
          balanceInWei.toString(), //amount, in wei
          ROPSTEN_WETH_DECIMALS, //Luckily both ETH and WETH have 18 decimals, so this should not be an issue.
          parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
          balanceInEth.toString(), //This is the actual display field, which has full precision.
          "ETH", //A white lie for display purposes
          "Ethereum", //A white lie for display purposes
          ethIcon,
          true //isNativeAsset
        );
      });
};

const createNativeBscParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : provider.getBalance(signerAddress).then((balanceInWei) => {
        const balanceInEth = ethers.utils.formatEther(balanceInWei);
        return createParsedTokenAccount(
          signerAddress, //public key
          WBNB_ADDRESS, //Mint key, On the other side this will be WBNB, so this is hopefully a white lie.
          balanceInWei.toString(), //amount, in wei
          WBNB_DECIMALS, //Luckily both BNB and WBNB have 18 decimals, so this should not be an issue.
          parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
          balanceInEth.toString(), //This is the actual display field, which has full precision.
          "BNB", //A white lie for display purposes
          "Binance Coin", //A white lie for display purposes
          bnbIcon,
          true //isNativeAsset
        );
      });
};

const createNativePolygonParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : provider.getBalance(signerAddress).then((balanceInWei) => {
        const balanceInEth = ethers.utils.formatEther(balanceInWei);
        return createParsedTokenAccount(
          signerAddress, //public key
          WMATIC_ADDRESS, //Mint key, On the other side this will be WMATIC, so this is hopefully a white lie.
          balanceInWei.toString(), //amount, in wei
          WMATIC_DECIMALS, //Luckily both MATIC and WMATIC have 18 decimals, so this should not be an issue.
          parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
          balanceInEth.toString(), //This is the actual display field, which has full precision.
          "MATIC", //A white lie for display purposes
          "Matic", //A white lie for display purposes
          polygonIcon,
          true //isNativeAsset
        );
      });
};

const createNativeAvaxParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : provider.getBalance(signerAddress).then((balanceInWei) => {
        const balanceInEth = ethers.utils.formatEther(balanceInWei);
        return createParsedTokenAccount(
          signerAddress, //public key
          WAVAX_ADDRESS, //Mint key, On the other side this will be wavax, so this is hopefully a white lie.
          balanceInWei.toString(), //amount, in wei
          WAVAX_DECIMALS,
          parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
          balanceInEth.toString(), //This is the actual display field, which has full precision.
          "AVAX", //A white lie for display purposes
          "Avalanche", //A white lie for display purposes
          avaxIcon,
          true //isNativeAsset
        );
      });
};

const createNativeOasisParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : provider.getBalance(signerAddress).then((balanceInWei) => {
        const balanceInEth = ethers.utils.formatEther(balanceInWei);
        return createParsedTokenAccount(
          signerAddress, //public key
          WROSE_ADDRESS, //Mint key, On the other side this will be wavax, so this is hopefully a white lie.
          balanceInWei.toString(), //amount, in wei
          WROSE_DECIMALS,
          parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
          balanceInEth.toString(), //This is the actual display field, which has full precision.
          "ROSE", //A white lie for display purposes
          "Rose", //A white lie for display purposes
          oasisIcon,
          true //isNativeAsset
        );
      });
};

const createNativeFantomParsedTokenAccount = (
  provider: Provider,
  signerAddress: string | undefined
) => {
  return !(provider && signerAddress)
    ? Promise.reject()
    : provider.getBalance(signerAddress).then((balanceInWei) => {
        const balanceInEth = ethers.utils.formatEther(balanceInWei);
        return createParsedTokenAccount(
          signerAddress, //public key
          WFTM_ADDRESS, //Mint key, On the other side this will be wavax, so this is hopefully a white lie.
          balanceInWei.toString(), //amount, in wei
          WFTM_DECIMALS,
          parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
          balanceInEth.toString(), //This is the actual display field, which has full precision.
          "FTM", //A white lie for display purposes
          "Fantom", //A white lie for display purposes
          fantomIcon,
          true //isNativeAsset
        );
      });
};

const createNFTParsedTokenAccountFromCovalent = (
  walletAddress: string,
  covalent: CovalentData,
  nft_data: CovalentNFTData
): NFTParsedTokenAccount => {
  return {
    publicKey: walletAddress,
    mintKey: covalent.contract_address,
    amount: nft_data.token_balance,
    decimals: covalent.contract_decimals,
    uiAmount: Number(
      formatUnits(nft_data.token_balance, covalent.contract_decimals)
    ),
    uiAmountString: formatUnits(
      nft_data.token_balance,
      covalent.contract_decimals
    ),
    symbol: covalent.contract_ticker_symbol,
    name: covalent.contract_name,
    logo: covalent.logo_url,
    tokenId: nft_data.token_id,
    uri: nft_data.token_url,
    animation_url: nft_data.external_data.animation_url,
    external_url: nft_data.external_data.external_url,
    image: nft_data.external_data.image,
    image_256: nft_data.external_data.image_256,
    nftName: nft_data.external_data.name,
    description: nft_data.external_data.description,
  };
};

export type CovalentData = {
  contract_decimals: number;
  contract_ticker_symbol: string;
  contract_name: string;
  contract_address: string;
  logo_url: string | undefined;
  balance: string;
  quote: number | undefined;
  quote_rate: number | undefined;
  nft_data?: CovalentNFTData[];
};

export type CovalentNFTExternalData = {
  animation_url: string | null;
  external_url: string | null;
  image: string;
  image_256: string;
  name: string;
  description: string;
};

export type CovalentNFTData = {
  token_id: string;
  token_balance: string;
  external_data: CovalentNFTExternalData;
  token_url: string;
};

const getEthereumAccountsCovalent = async (
  walletAddress: string,
  nft: boolean,
  chainId: ChainId
): Promise<CovalentData[]> => {
  const url = COVALENT_GET_TOKENS_URL(chainId, walletAddress, nft);

  try {
    const output = [] as CovalentData[];
    const response = await axios.get(url);
    const tokens = response.data.data.items;

    if (tokens instanceof Array && tokens.length) {
      for (const item of tokens) {
        // TODO: filter?
        if (
          item.contract_decimals !== undefined &&
          item.contract_address &&
          item.balance &&
          item.balance !== "0" &&
          (nft
            ? item.supports_erc?.includes("erc721")
            : item.supports_erc?.includes("erc20"))
        ) {
          output.push({ ...item } as CovalentData);
        }
      }
    }

    return output;
  } catch (error) {
    return Promise.reject("Unable to retrieve your Ethereum Tokens.");
  }
};

/**
 * Fetches the balance of an asset for the connected wallet
 * This should handle every type of chain in the future, but only reads the Transfer state.
 */
function useGetAvailableTokens(nft: boolean = false) {
  const dispatch = useDispatch();

  const tokenAccounts = useSelector(
    nft
      ? selectNFTSourceParsedTokenAccounts
      : selectTransferSourceParsedTokenAccounts
  );

  const lookupChain = useSelector(
    nft ? selectNFTSourceChain : selectTransferSourceChain
  );
  const { provider, signerAddress } = useEthereumProvider();

  const [covalent, setCovalent] = useState<any>(undefined);
  const [covalentLoading, setCovalentLoading] = useState(false);
  const [covalentError, setCovalentError] = useState<string | undefined>(
    undefined
  );

  const [ethNativeAccount, setEthNativeAccount] = useState<any>(undefined);
  const [ethNativeAccountLoading, setEthNativeAccountLoading] = useState(false);
  const [ethNativeAccountError, setEthNativeAccountError] = useState<
    string | undefined
  >(undefined);


  const selectedSourceWalletAddress = useSelector(
    nft ? selectNFTSourceWalletAddress : selectSourceWalletAddress
  );
  const currentSourceWalletAddress: string | undefined = isEVMChain(lookupChain)
    ? signerAddress
    : undefined;

  const resetSourceAccounts = useCallback(() => {
    dispatch(
      nft
        ? setSourceWalletAddressNFT(undefined)
        : setSourceWalletAddress(undefined)
    );
    dispatch(
      nft
        ? setSourceParsedTokenAccountNFT(undefined)
        : setSourceParsedTokenAccount(undefined)
    );
    dispatch(
      nft
        ? setSourceParsedTokenAccountsNFT(undefined)
        : setSourceParsedTokenAccounts(undefined)
    );
    !nft && dispatch(setAmount(""));
    setCovalent(undefined); //These need to be included in the reset because they have balances on them.
    setCovalentLoading(false);
    setCovalentError("");

    setEthNativeAccount(undefined);
    setEthNativeAccountLoading(false);
    setEthNativeAccountError("");
  }, [setCovalent, dispatch, nft]);

  //TODO this useEffect could be somewhere else in the codebase
  //It resets the SourceParsedTokens accounts when the wallet changes
  useEffect(() => {
    if (
      selectedSourceWalletAddress !== undefined &&
      currentSourceWalletAddress !== undefined &&
      currentSourceWalletAddress !== selectedSourceWalletAddress
    ) {
      resetSourceAccounts();
      return;
    } else {
    }
  }, [
    selectedSourceWalletAddress,
    currentSourceWalletAddress,
    dispatch,
    resetSourceAccounts,
  ]);

  //Ethereum native asset load
  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_ETH &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativeEthParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("Unable to retrieve your ETH balance.");
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

  //Ethereum (Ropsten) native asset load
  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_ETHEREUM_ROPSTEN &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativeEthRopstenParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("Unable to retrieve your ETH balance.");
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

  //Binance Smart Chain native asset load
  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_BSC &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativeBscParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("Unable to retrieve your BNB balance.");
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

  //Polygon native asset load
  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_POLYGON &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativePolygonParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("Unable to retrieve your MATIC balance.");
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

  //TODO refactor all these into an isEVM effect
  //avax native asset load
  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_AVAX &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativeAvaxParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("Unable to retrieve your AVAX balance.");
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_OASIS &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativeOasisParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("Unable to retrieve your Oasis balance.");
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

  useEffect(() => {
    let cancelled = false;
    if (
      signerAddress &&
      lookupChain === CHAIN_ID_FANTOM &&
      !ethNativeAccount &&
      !nft
    ) {
      setEthNativeAccountLoading(true);
      createNativeFantomParsedTokenAccount(provider, signerAddress).then(
        (result) => {
          console.log("create native account returned with value", result);
          if (!cancelled) {
            setEthNativeAccount(result);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("");
          }
        },
        (error) => {
          if (!cancelled) {
            setEthNativeAccount(undefined);
            setEthNativeAccountLoading(false);
            setEthNativeAccountError("Unable to retrieve your Fantom balance.");
          }
        }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [lookupChain, provider, signerAddress, nft, ethNativeAccount]);

  //Ethereum covalent accounts load
  useEffect(() => {
    //const testWallet = "0xf60c2ea62edbfe808163751dd0d8693dcb30019c";
    // const nftTestWallet1 = "0x3f304c6721f35ff9af00fd32650c8e0a982180ab";
    // const nftTestWallet2 = "0x98ed231428088eb440e8edb5cc8d66dcf913b86e";
    // const nftTestWallet3 = "0xb1fadf677a7e9b90e9d4f31c8ffb3dc18c138c6f";
    // const nftBscTestWallet1 = "0x5f464a652bd1991df0be37979b93b3306d64a909";
    let cancelled = false;
    const walletAddress = signerAddress;
    if (walletAddress && isEVMChain(lookupChain) && !covalent) {
      //TODO less cancel
      !cancelled && setCovalentLoading(true);
      !cancelled &&
        dispatch(
          nft
            ? fetchSourceParsedTokenAccountsNFT()
            : fetchSourceParsedTokenAccounts()
        );
      getEthereumAccountsCovalent(walletAddress, nft, lookupChain).then(
        (accounts) => {
          !cancelled && setCovalentLoading(false);
          !cancelled && setCovalentError(undefined);
          !cancelled && setCovalent(accounts);
          !cancelled &&
            dispatch(
              nft
                ? receiveSourceParsedTokenAccountsNFT(
                    accounts.reduce((arr, current) => {
                      if (current.nft_data) {
                        current.nft_data.forEach((x) =>
                          arr.push(
                            createNFTParsedTokenAccountFromCovalent(
                              walletAddress,
                              current,
                              x
                            )
                          )
                        );
                      }
                      return arr;
                    }, [] as NFTParsedTokenAccount[])
                  )
                : receiveSourceParsedTokenAccounts(
                    accounts.map((x) =>
                      createParsedTokenAccountFromCovalent(walletAddress, x)
                    )
                  )
            );
        },
        () => {
          !cancelled &&
            dispatch(
              nft
                ? errorSourceParsedTokenAccountsNFT(
                    "Cannot load your Ethereum NFTs at the moment."
                  )
                : errorSourceParsedTokenAccounts(
                    "Cannot load your Ethereum tokens at the moment."
                  )
            );
          !cancelled &&
            setCovalentError("Cannot load your Ethereum tokens at the moment.");
          !cancelled && setCovalentLoading(false);
        }
      );

      return () => {
        cancelled = true;
      };
    }
    return ;
  }, [lookupChain, provider, signerAddress, dispatch, nft, covalent]);

  //Terra accounts load
  //At present, we don't have any mechanism for doing this.
  useEffect(() => {}, []);

  const ethAccounts = useMemo(() => {
    const output = { ...tokenAccounts };
    output.data = output.data?.slice() || [];
    output.isFetching = output.isFetching || ethNativeAccountLoading;
    output.error = output.error || ethNativeAccountError;
    ethNativeAccount && output.data && output.data.unshift(ethNativeAccount);
    return output;
  }, [
    ethNativeAccount,
    ethNativeAccountLoading,
    ethNativeAccountError,
    tokenAccounts,
  ]);

  return  isEVMChain(lookupChain)
    ? {
        tokenAccounts: ethAccounts,
        covalent: {
          data: covalent,
          isFetching: covalentLoading,
          error: covalentError,
          receivedAt: null, //TODO
        },
        resetAccounts: resetSourceAccounts,
      }
    : lookupChain === CHAIN_ID_TERRA
    ? {
        resetAccounts: resetSourceAccounts,
      }
    : undefined;
}

export default useGetAvailableTokens;
