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
  updateAssignment: (i: string | null, formData: any) => void
  deleteAssignment: (id: string) => void
}

export const AssignmentsContext = createContext<AppContextType>({
  assignments: [],
  filters: [],
  addAssignment: () => { },
  setAssignments: () => { },
  updateAssignment: () => { },
  deleteAssignment: () => { },
})
export const useAssignmentsContext = () => useContext(AssignmentsContext)

export const initAssignmentsContext = (
  snackbarContext: SnackbarContextType
) => {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [filters, setFilters] = useState<Filter[]>([
    'orderby-date',
    // 'orderby-alpha',
    // 'rendu',
    'non-rendu',
  ])
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
  function updateAssignment(id: string | null, formData: any) {
    return new Promise((resolve) => {
      if (id !== null) {
        const newAssignments = [...assignments]
        const index = newAssignments.findIndex(
          (assignment) => assignment._id === id
        )
        newAssignments[index].rendu = formData.rendu
        newAssignments[index].nom = formData.nom
        newAssignments[index].dateDeRendu = formData.dateDeRendu

        fetch('/api/assignments', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAssignments[index]),
        })
          .then((payload) => {
            if (payload.status === 200) {
              setAssignments(newAssignments)
              push(`Assignment ${newAssignments[index].nom} modifié !`, 'success')
              resolve({ newAssignment: newAssignments[index] })
            } else {
              payload.json().then((data) => {
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
          const deletedAssignment = assignments.find(
            (assignment) => assignment._id === id
          )
          const newAssignments = assignments.filter(
            (assignment) => assignment._id !== id
          )
          setAssignments(newAssignments)
          push(`Assignment ${deletedAssignment?.nom} supprimé !`, 'success')
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
  //   const queries = generateFiltersQueries()
  //   console.log(queries)

  //   fetch('/api/assignments' + queries, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .then((res) => {
  //       res.json().then((payload) => {
  //         if (res.status === 200) {
  //           console.log(payload.data)
  //           setAssignments(payload.data)
  //         } else {
  //           console.error(payload.message)
  //           push(`Erreur: ${payload.message}`, 'error')
  //         }
  //       })
  //     })
  //     .catch((err) => {
  //       console.error(err)
  //       push(`Erreur: ${err}`, 'error')
  //     })
  // }, [filters])

  function generateFiltersQueries() {
    let queries = ''
    if (filters.length > 0) {
      queries += '?'
      filters.forEach((filter, i) => {
        queries += filter
        if (i !== filters.length - 1) {
          queries += '&'
        }
      })
    }
    return queries
  }

  return {
    assignments,
    filters,
    addAssignment,
    setAssignments,
    updateAssignment,
    deleteAssignment,
  }
}
