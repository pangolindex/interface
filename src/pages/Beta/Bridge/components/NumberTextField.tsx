import React from 'react'
import {
  Button,
  InputAdornment,
  TextField,
  TextFieldProps,
} from "@material-ui/core";

export default function NumberTextField({
  onMaxClick,
  ...props
}: TextFieldProps & { onMaxClick?: () => void }) {
  return (
    <TextField
      style={{color: 'white'}}
      type="number"
      {...props}
      InputProps={{
        endAdornment: onMaxClick ? (
          <InputAdornment position="end" style={{color: 'white'}}>
            <Button
              onClick={onMaxClick}
              disabled={props.disabled}
              variant="outlined"
              style={{color: 'white'}}
            >
              Max
            </Button>
          </InputAdornment>
        ) : undefined,
        ...(props?.InputProps || {}),
      }}
    ></TextField>
  );
}
