import { createContext, useContext } from 'react'
import Assignment from '@/types/Assignment'
import Filter from '@/types/Filter'
import { useState, useEffect } from 'react'
import { SnackbarContextType } from './SnackbarContext'

export type AppContextType = {
  assignments: Assignment[]
  filters: Filter[]
  addAssignment: (assignment: Assignment) => void
  setAssignments: (new_assignments: Assignment[]) => void
  setAssignmentRendu: (i: string | null) => void
  deleteAssignment: (id: string) => void
}

export const AssignmentsContext = createContext<AppContextType>({
  assignments: [],
  filters: [],
  addAssignment: () => {},
  setAssignments: () => {},
  setAssignmentRendu: () => {},
  deleteAssignment: () => {},
})
export const useAssignmentsContext = () => useContext(AssignmentsContext)

export const initAssignmentsContext = (
  snackbarContext: SnackbarContextType
) => {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [filters, setFilters] = useState<Filter[]>([])
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
  function setAssignmentRendu(id: string | null) {
    return new Promise((resolve) => {
      if (id !== null) {
        const newAssignments = [...assignments]
        const index = newAssignments.findIndex(
          (assignment) => assignment._id === id
        )
        newAssignments[index].rendu = true
        fetch('/api/assignments', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAssignments[index]),
        })
          .then(() => {
            setAssignments(newAssignments)
            push(`Assignment ${newAssignments[index].nom} rendu !`, 'success')
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

  // useEffect(() => {
  //   const queries = generateQueries()
  //   fetch('/api/assignments'+queries, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .then((payload) => {
  //       setAssignments(payload.data)
  //     })
  //     .catch((err) => {
  //       console.error(err)
  //       push(`Erreur: ${err}`, 'error')
  //       resolve(null)
  //     })
  // }, [filters])

  return {
    assignments,
    filters,
    setFilters,
    addAssignment,
    setAssignments,
    setAssignmentRendu,
    deleteAssignment,
  }
}
