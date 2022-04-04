import React from 'react'
import {
  ListItemIcon,
  makeStyles,
  ListItemText,
  MenuItem,
  OutlinedTextFieldProps,
  TextField,
} from "@material-ui/core";
import clsx from "clsx";
import { useMemo } from "react";
import { useBetaContext } from "src/contexts/BetaContext";
import { BETA_CHAINS, ChainInfo } from "src/utils/bridgeUtils/consts";
import { Text } from '@pangolindex/components'

const useStyles = makeStyles((theme) => ({
  select: {
    paddingTop: 0,
    paddingBottom: 0,
    "& .MuiSelect-root": {
      display: "flex",
      alignItems: "center",
    },
  },
  listItemIcon: {
    minWidth: 40,
  },
  icon: {
    height: 24,
    maxWidth: 24,
  },
  listItemColor: {
    display: 'flex',
    alignItems: "center",
    padding: "8px",
    cursor: 'pointer',
    backgroundColor: "#1c1c1c",

    "&:hover": {
      backgroundColor: "#212427",
    },
  },
}));

const createChainMenuItem = ({ id, name, logo }: ChainInfo, classes: any) => (
  <div key={id} value={id} className={classes.listItemColor} >
    <ListItemIcon className={classes.listItemIcon}>
      <img src={logo} alt={name} className={classes.icon} />
    </ListItemIcon>
    {/* <ListItemText>{name}</ListItemText> */}
    <Text fontSize={20} fontWeight={500} lineHeight="12px" color="text10">
    {name}
   </Text>
  </div>
);

interface ChainSelectProps extends OutlinedTextFieldProps {
  chains: ChainInfo[];
}

export default function ChainSelect({ chains, ...rest }: ChainSelectProps) {
  const classes = useStyles();
  const isBeta = useBetaContext();
  const filteredChains = useMemo(
    () =>
      chains.filter(({ id }) => (isBeta ? true : !BETA_CHAINS.includes(id))),
    [chains, isBeta]
  );
  return (
    <TextField {...rest} className={clsx(classes.select, rest.className)}>
      {filteredChains.map((chain) => createChainMenuItem(chain, classes))}
    </TextField>
  );
}
