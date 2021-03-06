import { AppProps } from 'next/app'
import '@/styles/global.css'
import { Snackbar, Alert } from '@mui/material'

import {
  AssignmentsContext,
  initAssignmentsContext,
} from '@/contexts/AssignmentsContext'
import { AuthContext, initAuthContext } from '@/contexts/AuthContext'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
import {
  initSnackbarContext,
  SnackbarContext,
} from '@/contexts/SnackbarContext'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps }: AppProps) {
  //Initialize contexts
  const router = useRouter()
  const snackbarContext = initSnackbarContext()
  const assignmentsContext = initAssignmentsContext(snackbarContext, router)
  const authContext = initAuthContext()

  //Initialize MUI dark theme
  const darkTheme = createTheme({ palette: { mode: 'dark' } })

  return (
    <SnackbarContext.Provider value={snackbarContext}>
      <AssignmentsContext.Provider value={assignmentsContext}>
        <AuthContext.Provider value={authContext}>
          <ThemeProvider theme={darkTheme}>
            <Snackbar
              open={snackbarContext.snackbar.open}
              autoHideDuration={30000}
              onClose={snackbarContext.handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <Alert
                severity={snackbarContext.snackbar.severity as any}
                sx={{ width: '100%' }}
              >
                {snackbarContext.snackbar.message}
              </Alert>
            </Snackbar>
            <Head>
              <title>Assignments</title>
            </Head>
            <Component {...pageProps} />
          </ThemeProvider>
        </AuthContext.Provider>
      </AssignmentsContext.Provider>
    </SnackbarContext.Provider>
  )
}
