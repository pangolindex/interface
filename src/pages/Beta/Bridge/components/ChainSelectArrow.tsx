import React from 'react'
import { IconButton } from "@material-ui/core";
import { ArrowForward, SwapHoriz } from "@material-ui/icons";
import { useState } from "react";
import Arrow from "src/assets/images/arrow-bridge.png"
import ArrowUp from "src/assets/images/arrow-bridge-up.png"

export default function ChainSelectArrow({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  const [showSwap, setShowSwap] = useState(false);

  return (
    <IconButton
      onClick={onClick}
      onMouseEnter={() => {
        setShowSwap(true);
      }}
      onMouseLeave={() => {
        setShowSwap(false);
      }}
      disabled={disabled}
      style={{color: "white"}}
    >
      {showSwap ? <img src={ArrowUp} /> : <img src={Arrow} />}
      
    </IconButton>
  );
}
