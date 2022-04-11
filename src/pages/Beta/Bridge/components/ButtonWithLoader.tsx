import React from 'react'
import { ReactChild } from 'react'
import { Text, Button } from "@pangolindex/components"

export default function ButtonWithLoader({
  disabled,
  onClick,
  showLoader,
  error,
  children
}: {
  disabled?: boolean
  onClick: () => void
  showLoader?: boolean
  error?: string
  children: ReactChild
}) {
  return (
    <>
      {disabled ? (
        <>
          <div style={{position: 'relative', padding: '10px 0 10px 0'}}>
            <Button
              color="black"
              variant="outline"
              onClick={onClick}
              isDisabled
            >
              {children}
            </Button>
            {/* {showLoader ? <CircularProgress size={24} color="inherit" className={classes.loader} /> : null} */}
          </div>
          {error ? (
            <Text fontSize={15} fontWeight={300} lineHeight="15px" color="avaxRed" textAlign="center" >
              {error}
            </Text>
          ) : null}
        </>
      ) : (
        <>
          <div style={{position: 'relative', padding: '10px 0 10px 0'}}>
            <Button
              color="white"
              variant="outline"
              onClick={onClick}
            >
              {children}
            </Button>
            {/* {showLoader ? <CircularProgress size={24} color="inherit" className={classes.loader} /> : null} */}
          </div>
          {error ? (
            <Text fontSize={15} fontWeight={300} lineHeight="15px" color="avaxRed" textAlign="center">
              {error}
            </Text>
          ) : null}
        </>
      )}
    </>
  )
}
