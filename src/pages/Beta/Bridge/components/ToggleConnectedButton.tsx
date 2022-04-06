import React from 'react'
import { Button, makeStyles, Tooltip } from '@material-ui/core'
import { LinkOff } from '@material-ui/icons'
import { Text } from '@pangolindex/components'

const useStyles = makeStyles(theme => ({
  button: {
    display: 'flex',
    margin: `${theme.spacing(1)}px auto`,
    width: '100%',
    height: '3em',
    maxWidth: 400,
    backgroundColor: '#FFC800',
    '&:hover': {
      backgroundColor: 'rgba(255, 200, 0, 0.8)'
    }
  }
}))

const ToggleConnectedButton = ({
  connect,
  disconnect,
  connected,
  pk
}: {
  connect(): any
  disconnect(): any
  connected: boolean
  pk: string
}) => {
  const classes = useStyles()
  const is0x = pk.startsWith('0x')
  return connected ? (
    <Tooltip title={pk}>
      <Button
        color="primary"
        variant="contained"
        size="small"
        onClick={disconnect}
        className={classes.button}
        startIcon={<LinkOff style={{ color: 'black' }} />}
      >
        <Text fontSize={15} fontWeight={500} lineHeight="12px" color="text5">
          Disconnect {pk.substring(0, is0x ? 6 : 3)}...
          {pk.substr(pk.length - (is0x ? 4 : 3))}
        </Text>
      </Button>
    </Tooltip>
  ) : (
    <Button color="primary" variant="contained" size="small" onClick={connect} className={classes.button}>
      <Text fontSize={15} fontWeight={500} lineHeight="12px" color="text5">
        Connect
      </Text>
    </Button>
  )
}

export default ToggleConnectedButton
