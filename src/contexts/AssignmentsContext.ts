import { createContext, useContext } from 'react'
import Assignment from 'types/Assignment'

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