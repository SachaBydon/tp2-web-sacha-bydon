import { createContext, useContext } from 'react'
import Assignment from 'types/Assignment'

export type AppContextType = {
  assignments: Assignment[]
  addAssignment: (assignment: Assignment) => void
  setAssignmentRendu: (i: number | null) => void
}

export const AppContext = createContext<AppContextType>({
  assignments: [],
  addAssignment: () => {},
  setAssignmentRendu: () => {},
})
export const useContextState = () => useContext(AppContext)
