import './App.less'
import { Assignments } from './components'
import { AppContext } from './AppContext'
import Assignment from './types/Assignment'
import { useState } from 'react'

// TODO: change rsuit for MUI
// TODO: fix aliases
function App() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    { nom: 'TP1', dateDeRendu: '17/11/2020', rendu: true },
    { nom: 'TP2', dateDeRendu: '15/12/2020', rendu: false },
    { nom: 'TP3', dateDeRendu: '01/04/2020', rendu: false },
  ])

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

  return (
    <AppContext.Provider
      value={{ assignments, addAssignment, setAssignmentRendu }}
    >
      <div className="App">
        <Assignments />
      </div>
    </AppContext.Provider>
  )
}

export default App
