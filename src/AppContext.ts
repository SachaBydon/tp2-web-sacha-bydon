import { createContext, useContext } from 'react'
import Assignment from 'types/Assignment'

export type AppContextType = {
  assignments: Assignment[]
  addAssignment: (assignment: Assignment) => void
  setAssignmentRendu: (i: number | null) => void
  deleteAssignment: (i: number) => void
}

export const AppContext = createContext<AppContextType>({
  assignments: [],
  addAssignment: () => {},
  setAssignmentRendu: () => {},
  deleteAssignment: () => {},
})
export const useContextState = () => useContext(AppContext)
