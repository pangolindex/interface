import React, { useCallback, useState } from "react";
import { MsgExecuteContract } from "@terra-money/terra.js";
import {
  ConnectedWallet,
  useConnectedWallet,
} from "@terra-money/wallet-provider";
import {
  SUPPORTED_TERRA_TOKENS,
  TERRA_TOKEN_BRIDGE_ADDRESS,
} from "src/utils/bridgeUtils/consts";
import TerraWalletKey from "./TerraWalletKey";
import { postWithFees, waitForTerraExecution } from "src/utils/bridgeUtils/terra";
import ButtonWithLoader from "./ButtonWithLoader";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { selectTerraFeeDenom } from "src/store/selectors";
import TerraFeeDenomPicker from "./TerraFeeDenomPicker";
import { Text } from '@pangolindex/components'

const withdraw = async (
  wallet: ConnectedWallet,
  token: string,
  feeDenom: string
) => {
  const withdraw = new MsgExecuteContract(
    wallet.walletAddress,
    TERRA_TOKEN_BRIDGE_ADDRESS,
    {
      withdraw_tokens: {
        asset: {
          native_token: {
            denom: token,
          },
        },
      },
    },
    {}
  );
  const txResult = await postWithFees(
    wallet,
    [withdraw],
    "Wormhole - Withdraw Tokens",
    [feeDenom]
  );
  await waitForTerraExecution(txResult);
};

export default function WithdrawTokensTerra() {
  const wallet = useConnectedWallet();
  const [token, setToken] = useState(SUPPORTED_TERRA_TOKENS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const feeDenom = useSelector(selectTerraFeeDenom);

  const handleClick = useCallback(() => {
    if (wallet) {
      (async () => {
        setIsLoading(true);
        try {
          await withdraw(wallet, token, feeDenom);
          enqueueSnackbar(null, {
            content: <Text fontSize={15} fontWeight={200} lineHeight="20px" style={{color: '#27AE60'}} >Transaction confirmed.</Text>,
          });
        } catch (e) {
          enqueueSnackbar(null, {
            content: <Text fontSize={15} fontWeight={200} lineHeight="20px" color="avaxRed" >Error withdrawing tokens.</Text>,
          });
          console.error(e);
        }
        setIsLoading(false);
      })();
    }
  }, [wallet, token, enqueueSnackbar, feeDenom]);

  return (
    <div>
      <Text fontSize={24} fontWeight={500} lineHeight="24px" color="white" style={{ textAlign: 'center' }}>Withdraw Tokens</Text>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <Text fontSize={15} fontWeight={500} lineHeight="15px" color="white" style={{ textAlign: 'center' }}>
          Withdraw tokens from the Terra token bridge
        </Text>
        <TerraWalletKey />
        <div style={{display: "flex", margin: "20px auto", width: "100%", maxWidth: 400, textAlign: "center"}}>
          <Text fontSize={15} fontWeight={500} lineHeight="15px" color="white">Token</Text>
          <div
            value={token}
            onChange={(event) => {
              setToken(event.target.value as string);
            }}
          >
            {SUPPORTED_TERRA_TOKENS.map((name) => (
              <div key={name} value={name}>
                {name}
              </div>
            ))}
          </div>
          <TerraFeeDenomPicker disabled={isLoading} />
          <ButtonWithLoader
            onClick={handleClick}
            disabled={!wallet || isLoading}
            showLoader={isLoading}
          >
            Withdraw
          </ButtonWithLoader>
        </div>
      </div>
    </div>
  );
}
