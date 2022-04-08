import { isEVMChain } from "@certusone/wormhole-sdk";
import ArrowDown from "src/assets/images/arrow-down.png"
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectTransferOriginChain,
  selectTransferSourceChain,
  selectTransferSourceParsedTokenAccount,
} from "src/store/selectors";
import { CHAINS_BY_ID, MULTI_CHAIN_TOKENS } from "src/utils/bridgeUtils/consts";
import SmartAddress from "../SmartAddress";
import { useTargetInfo } from "./Target";
import TokenWarning from "./TokenWarning";
import { Text, Button } from "@pangolindex/components"
import Modal from 'src/components/Modal'

function SendConfirmationContent({
  open,
  onClose,
  onClick,
}: {
  open: boolean;
  onClose: () => void;
  onClick: () => void;
}) {
  const sourceChain = useSelector(selectTransferSourceChain);
  const sourceParsedTokenAccount = useSelector(
    selectTransferSourceParsedTokenAccount
  );
  const { targetChain, targetAsset, symbol, tokenName, logo } = useTargetInfo();
  const originChain = useSelector(selectTransferOriginChain);

  //TODO this check is essentially duplicated.
  const deservesTimeout = useMemo(() => {
    if (originChain && sourceParsedTokenAccount?.mintKey) {
      const searchableAddress = isEVMChain(originChain)
        ? sourceParsedTokenAccount.mintKey.toLowerCase()
        : sourceParsedTokenAccount.mintKey;
      return (
        originChain !== targetChain &&
        !!MULTI_CHAIN_TOKENS[sourceChain]?.[searchableAddress]
      );
    } else {
      return false;
    }
  }, [originChain, targetChain, sourceChain, sourceParsedTokenAccount]);
  const timeoutDuration = 5;

  const [countdown, setCountdown] = useState(
    deservesTimeout ? timeoutDuration : 0
  );

  useEffect(() => {
    if (!deservesTimeout || countdown === 0) {
      return;
    }
    let cancelled = false;

    setInterval(() => {
      if (!cancelled) {
        setCountdown((state) => state - 1);
      }
    }, 1000);

    return () => {
      cancelled = true;
    };
  }, [deservesTimeout, countdown]);

  useEffect(() => {
    if (open && deservesTimeout) {
      //Countdown starts on mount, but we actually want it to start on open
      setCountdown(timeoutDuration);
    }
  }, [open, deservesTimeout]);

  const sendConfirmationContent = (
    <div style={{backgroundColor: "#1C1C1C", padding: '20px'}}>
      <Text fontSize={22} fontWeight={500} lineHeight="20px" color="white" >Are you sure?</Text>
      <div style={{marginTop: "20px"}}>
        {targetAsset ? (
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Text fontSize={17} fontWeight={500} lineHeight="20px" color="white" >
              You are about to perform this transfer:
            </Text>
            <SmartAddress
              variant="h6"
              chainId={sourceChain}
              parsedTokenAccount={sourceParsedTokenAccount}
            />
            <div>
              <Text fontSize={17} fontWeight={300} lineHeight="20px" color="white" >
                {CHAINS_BY_ID[sourceChain].name}
              </Text>
            </div>
            <div style={{ paddingTop: 4 }}>
              <img src={ArrowDown} />
              {/* <ArrowDownward fontSize="inherit" style={{color: "white"}} /> */}
            </div>
            <SmartAddress
              variant="h6"
              chainId={targetChain}
              address={targetAsset}
              symbol={symbol}
              tokenName={tokenName}
              logo={logo}
            />
            <div>
              <Text fontSize={17} fontWeight={300} lineHeight="20px" color="white" >
                {CHAINS_BY_ID[targetChain].name}
              </Text>
            </div>
          </div>
        ) : null}
        <TokenWarning
          sourceAsset={sourceParsedTokenAccount?.mintKey}
          sourceChain={sourceChain}
          originChain={originChain}
          targetAsset={targetAsset ?? undefined}
          targetChain={targetChain}
        />
      </div>
      <div style={{ display: 'flex', gap: '10px'}}>
        <Button variant="outline" onClick={onClose}>
          <Text fontSize={13} fontWeight={500} lineHeight="12px" color="text10">
            Cancel
          </Text>
        </Button>
        <Button
          variant="primary"
          onClick={onClick}
        >
          {!!countdown ? countdown.toString() : "Confirm"}
        </Button>
      </div>
    </div>
  );

  return sendConfirmationContent;
}

export default function SendConfirmationDialog({
  open,
  onClick,
  onClose,
}: {
  open: boolean;
  onClick: () => void;
  onClose: () => void;
}) {
  return (
    <Modal onDismiss={onClose} isOpen={open}>
      <SendConfirmationContent
        open={open}
        onClose={onClose}
        onClick={onClick}
      />
      </Modal>
  );
}
