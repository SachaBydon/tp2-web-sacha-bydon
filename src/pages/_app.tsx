import { AppProps } from 'next/app'
import '@/styles/global.css'
import '@/styles/AddAssignment.scss'
import '@/styles/Assignments.scss'
import '@/styles/Login.scss'

import {
  AssignmentsContext,
  initAssignmentsContext,
} from '@/contexts/AssignmentsContext'
import { AuthContext, initAuthContext } from '@/contexts/AuthContext'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
import { CustomRoutes } from '@/components'

//TODO: add eslint
export default function MyApp({ Component, pageProps, router }: AppProps) {
  const assignmentsContext = initAssignmentsContext()
  const authContext = initAuthContext()
  const darkTheme = createTheme({ palette: { mode: 'dark' } })

  return (
    <AssignmentsContext.Provider value={assignmentsContext}>
      <AuthContext.Provider value={authContext}>
        <ThemeProvider theme={darkTheme}>
          <Component {...pageProps} />
          {/* <CustomRoutes router={router}>
          </CustomRoutes> */}
        </ThemeProvider>
      </AuthContext.Provider>
    </AssignmentsContext.Provider>
  )
}
