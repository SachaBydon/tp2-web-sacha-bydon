import './App.scss'
import {
  AssignmentsContext,
  initAssignmentsContext,
} from '@/contexts/AssignmentsContext'
import { AuthContext, initAuthContext } from '@/contexts/AuthContext'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import { Route } from '@/components'
import { Home, Login } from '@/views'

function App() {
  const assignmentsContext = initAssignmentsContext()
  const authContext = initAuthContext()
  const darkTheme = createTheme({ palette: { mode: 'dark' } })

  return (
    <AssignmentsContext.Provider value={assignmentsContext}>
      <AuthContext.Provider value={authContext}>
        <ThemeProvider theme={darkTheme}>
          <Router>
            <div className="App">
              <Switch>
                <Route path="/login">
                  <Login />
                </Route>
                <Route path="/" isProtected>
                  <Home />
                </Route>
              </Switch>
            </div>
          </Router>
        </ThemeProvider>
      </AuthContext.Provider>
    </AssignmentsContext.Provider>
  )
}

export default App
