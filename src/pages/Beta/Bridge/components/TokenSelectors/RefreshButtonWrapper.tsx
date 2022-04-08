import React from "react";
import Refresh from "src/assets/images/refresh.png";
import { Text } from "@pangolindex/components"

export default function RefreshButtonWrapper({
  children,
  callback,
}: {
  children: JSX.Element;
  callback: () => any;
}) {

  const refreshWrapper = (
    <div style={{display: "flex", alignItems: "center", cursor: 'pointer', gap: '15px', border: "1px solid white", padding: "20px"}} onClick={callback}>
      <Text fontSize={13} fontWeight={500} lineHeight="12px" color="text10" style={{display: "inline-block", flexGrow: 1}}>{children}</Text>
      <img src={Refresh} style={{width: "15px"}} />
    </div>
  );

  return refreshWrapper;
}