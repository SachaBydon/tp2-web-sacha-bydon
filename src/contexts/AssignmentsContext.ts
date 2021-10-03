import { createContext, useContext } from 'react'
import Assignment from '@/types/Assignment'
import { useState } from 'react'

export type AppContextType = {
  assignments: Assignment[]
  addAssignment: (assignment: Assignment) => void
  setAssignments: (new_assignments: Assignment[]) => void
  setAssignmentRendu: (i: number | null) => void
  deleteAssignment: (i: number) => void
}

export const AssignmentsContext = createContext<AppContextType>({
  assignments: [],
  addAssignment: () => { },
  setAssignments: () => { },
  setAssignmentRendu: () => { },
  deleteAssignment: () => { },
})
export const useAssignmentsContext = () => useContext(AssignmentsContext)

export const initAssignmentsContext = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([])

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
    setAssignments,
    setAssignmentRendu,
    deleteAssignment,
  }
}
