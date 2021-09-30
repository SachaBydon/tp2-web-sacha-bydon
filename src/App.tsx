import './App.scss'
import { AssignmentsContext } from './contexts/AssignmentsContext'
import { AuthContext } from './contexts/AuthContext'
import Assignment from './types/Assignment'
import { useState } from 'react'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import Home from './views/Home'
import Login from './views/Login/Login'
import { Route } from './components'

// TODO: fix aliases
function App() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    { nom: 'TP1', dateDeRendu: '17/11/2020', rendu: true },
    { nom: 'TP2', dateDeRendu: '15/12/2020', rendu: false },
    { nom: 'TP3', dateDeRendu: '01/04/2020', rendu: false },
  ])
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [admin, setAdmin] = useState<boolean>(false)

  function addAssignment(assignment: Assignment) {
    setAssignments([...assignments, assignment])
  }
  function setAssignmentRendu(i: number | null) {
    if (i !== null) {
      const newAssignments = [...assignments]
      newAssignments[i].rendu = true
      setAssignments(newAssignments)
    }
  }
  function deleteAssignment(i: number) {
    const newAssignments = [...assignments]
    newAssignments.splice(i, 1)
    setAssignments(newAssignments)
  }

  function login(user: any): Promise<{valid: boolean}> {
    return new Promise<{valid: boolean}>((resolve) => {
      setTimeout(() => {
        if (user.name === 'admin' && user.password === 'admin') {
          setLoggedIn(true)
          setAdmin(true)
          resolve({ valid: true })
        } else if(user.name === 'user' && user.password === 'user') {
          setLoggedIn(true)
          resolve({ valid: true })
        } else {
          resolve({ valid: false })
        }
      }, 1000)
    })
  }

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  })

  return (
    <AssignmentsContext.Provider
      value={{
        assignments,
        addAssignment,
        setAssignmentRendu,
        deleteAssignment,
      }}
    >
      <AuthContext.Provider value={{ loggedIn, login, admin }}>
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
