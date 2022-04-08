import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTransferRedeemTx,
  selectTransferTargetChain,
} from "src/store/selectors";
import { reset } from "src/store/transferSlice";
import ButtonWithLoader from "../ButtonWithLoader";
import ShowTx from "../ShowTx";
import AddToMetamask from "./AddToMetamask";
import FeaturedMarkets from "./FeaturedMarkets";
import { Text } from '@pangolindex/components'

export default function RedeemPreview() {
  const dispatch = useDispatch();
  const targetChain = useSelector(selectTransferTargetChain);
  const redeemTx = useSelector(selectTransferRedeemTx);
  const handleResetClick = useCallback(() => {
    dispatch(reset());
  }, [dispatch]);

  const explainerString =
    "Success! The redeem transaction was submitted. The tokens will become available once the transaction confirms.";

  return (
    <>
      <Text fontSize={15} fontWeight={300} lineHeight="20px" color="white">
        {explainerString}
      </Text>
      {redeemTx ? <ShowTx chainId={targetChain} tx={redeemTx} /> : null}
      <AddToMetamask />
      <FeaturedMarkets />
      <ButtonWithLoader onClick={handleResetClick}>
        Transfer More Tokens!
      </ButtonWithLoader>
    </>
  );
}
