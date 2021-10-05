import { createContext, useContext } from 'react'
import Assignment from '@/types/Assignment'
import { useState } from 'react'
import { SnackbarContextType, useSnackbar } from './SnackbarContext'

export type AppContextType = {
  assignments: Assignment[]
  addAssignment: (assignment: Assignment) => void
  setAssignments: (new_assignments: Assignment[]) => void
  setAssignmentRendu: (i: number | null) => void
  deleteAssignment: (id: string) => void
}

export const AssignmentsContext = createContext<AppContextType>({
  assignments: [],
  addAssignment: () => {},
  setAssignments: () => {},
  setAssignmentRendu: () => {},
  deleteAssignment: () => {},
})
export const useAssignmentsContext = () => useContext(AssignmentsContext)

export const initAssignmentsContext = (snackbarContext: SnackbarContextType) => {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const { push } = snackbarContext

  function addAssignment(assignment: Assignment) {
    return new Promise((resolve) => {
      fetch('/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignment),
      })
        .then((res) => {
          if (res.status === 200) {
            res.json().then((payload) => {
              console.log(payload.data)
              payload.data.rendu = payload.data.rendu === 'true' ? true : false
              setAssignments((prev) => [...prev, payload.data])
              push(`Assignment ${payload.data.nom} ajouté !`, 'success')
              resolve(null)
            })
          } else {
            res.json().then((data) => {
              console.error(data.message)
              push(`Erreur: ${data.message}`, 'error')
              resolve(null)
            })
          }
        })
        .catch((err) => {
          console.error(err)
          push(`Erreur: ${err}`, 'error')
          resolve(null)
        })
    })
  }
  function setAssignmentRendu(id: number | null) {
    return new Promise((resolve) => {
      if (id !== null) {
        const newAssignments = [...assignments]
        newAssignments[id].rendu = true
        fetch('/api/assignments', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAssignments[id]),
        })
          .then(() => {
            setAssignments(newAssignments)
            push(`Assignment ${newAssignments[id].nom} rendu !`, 'success')
            resolve(null)
          })
          .catch((err) => {
            console.error(err)
            push(`Erreur: ${err}`, 'error')
            resolve(null)
          })
      } else {
        resolve(null)
      }
    })
  }
  function deleteAssignment(id: string) {
    return new Promise((resolve) => {
      fetch('/api/assignments?id=' + id, {
        method: 'DELETE',
      })
        .then(() => {
          const newAssignments = assignments.filter(
            (assignment) => assignment._id !== id
          )
          setAssignments(newAssignments)
          push(`Assignment ${id} supprimé !`, 'success')
          resolve(null)
        })
        .catch((err) => {
          console.error(err)
          push(`Erreur: ${err}`, 'error')
          resolve(null)
        })
    })
  }

  return {
    assignments,
    addAssignment,
    setAssignments,
    setAssignmentRendu,
    deleteAssignment,
  }
}
