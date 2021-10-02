import { createContext, useContext } from 'react'
import Assignment from '@/types/Assignment'
import { useState } from 'react'

export type AppContextType = {
  assignments: Assignment[]
  addAssignment: (assignment: Assignment) => void
  setAssignmentRendu: (i: number | null) => void
  deleteAssignment: (i: number) => void
}

export const AssignmentsContext = createContext<AppContextType>({
  assignments: [],
  addAssignment: () => {},
  setAssignmentRendu: () => {},
  deleteAssignment: () => {},
})
export const useAssignmentsContext = () => useContext(AssignmentsContext)

export const initAssignmentsContext = () => {
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
  function deleteAssignment(i: number) {
    const newAssignments = [...assignments]
    newAssignments.splice(i, 1)
    setAssignments(newAssignments)
  }

  return {
    assignments,
    addAssignment,
    setAssignmentRendu,
    deleteAssignment,
  }
}
