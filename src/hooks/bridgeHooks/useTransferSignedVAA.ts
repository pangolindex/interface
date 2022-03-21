import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectTransferSignedVAAHex } from "src/store/selectors";
import { hexToUint8Array } from "@certusone/wormhole-sdk";

export default function useTransferSignedVAA() {
  const signedVAAHex = useSelector(selectTransferSignedVAAHex);
  const signedVAA = useMemo(
    () => (signedVAAHex ? hexToUint8Array(signedVAAHex) : undefined),
    [signedVAAHex]
  );
  return signedVAA;
}
