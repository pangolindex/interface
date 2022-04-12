import React from 'react'
import { makeStyles, OutlinedTextFieldProps, TextField } from '@material-ui/core'
import clsx from 'clsx'
import { useMemo } from 'react'
import { useBetaContext } from 'src/contexts/BetaContext'
import { BETA_CHAINS, ChainInfo } from 'src/utils/bridgeUtils/consts'
import { Text } from '@pangolindex/components'

const useStyles = makeStyles(theme => ({
  select: {
    paddingTop: 0,
    paddingBottom: 0,
    '& .MuiSelect-root': {
      display: 'flex',
      alignItems: 'center'
    }
  },
}))

const createChainMenuItem = ({ id, name, logo }: ChainInfo, classes: any) => (
  <div 
  key={id} 
  value={id}
  style={{
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    cursor: 'pointer',
    backgroundColor: '#1c1c1c',
    marginTop: '-8px',
    marginBottom: '-8px'}}
  >
    <div style={{minWidth: 40}}>
      <img src={logo} alt={name} style={{height: 24, maxWidth: 24}} />
    </div>
    {/* <ListItemText>{name}</ListItemText> */}
    <Text fontSize={20} fontWeight={500} lineHeight="12px" color="text10">
      {name}
    </Text>
  </div>
)

interface ChainSelectProps extends OutlinedTextFieldProps {
  chains: ChainInfo[]
}

export default function ChainSelect({ chains, ...rest }: ChainSelectProps) {
  const classes = useStyles()
  const isBeta = useBetaContext()
  const filteredChains = useMemo(() => chains.filter(({ id }) => (isBeta ? true : !BETA_CHAINS.includes(id))), [
    chains,
    isBeta
  ])
  return (
    <TextField {...rest} className={clsx(classes.select, rest.className)}>
      {filteredChains.map(chain => createChainMenuItem(chain, classes))}
    </TextField>
  )
}
