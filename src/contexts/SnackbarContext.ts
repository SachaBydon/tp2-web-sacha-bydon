import { createContext, useContext } from 'react'
import { useState } from 'react'

const defaultOptions = {
  open: false,
  message: '',
  severity: 'success',
}

export type SnackbarContextType = {
  snackbar: any
  push: (
    message: string,
    severity?: 'success' | 'error' | 'warning'
    ) => void
  handleClose: (event: any, reason: any) => void
}

export const SnackbarContext = createContext<SnackbarContextType>({
  snackbar: defaultOptions,
  push: () => {},
  handleClose: () => {},
})
export const useSnackbar = () => useContext(SnackbarContext)

/**
 * Assignment context state
 */
export const initSnackbarContext = () => {
  
  const [snackbar, setSnackbar] = useState(defaultOptions)

  function push(message: string, severity?: 'success' | 'error' | 'warning') {
    setSnackbar({
      open: true,
      message: message,
      severity: severity ?? '',
    })
  }

  function handleClose(event: any, reason: any) {
    if (reason !== 'clickaway') setSnackbar(defaultOptions)
  }

  return {
    push,
    snackbar,
    handleClose
  }
}
