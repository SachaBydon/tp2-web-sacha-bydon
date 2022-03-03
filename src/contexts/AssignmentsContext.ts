import { createContext, useContext } from 'react'
import Assignment from '@/types/Assignment'
import { useState, useEffect } from 'react'
import { SnackbarContextType } from './SnackbarContext'
import { GridSortDirection, GridSortModel } from '@mui/x-data-grid'

export type Filter = {
  text: string
  rendu: 'true' | 'false' | 'none'
  sort: GridSortModel
}
export type AssignmentsContextType = {
  assignments: Assignment[]
  filters: Filter
  setFilters: (filters: Filter) => void
  addAssignment: (assignment: Assignment) => void
  setAssignments: (new_assignments: Assignment[]) => void
  updateAssignment: (i: string | null, formData: any) => void
  deleteAssignment: (id: string) => void
  loading: boolean
  nbPages: number
  setNbPages: (id: number) => void
  page: number
  setPage: (page: number) => void
}

export const AssignmentsContext = createContext<AssignmentsContextType>({
  assignments: [],
  filters: { text: '', rendu: 'none', sort: [] },
  setFilters: () => {},
  addAssignment: () => {},
  setAssignments: () => {},
  updateAssignment: () => {},
  deleteAssignment: () => {},
  loading: false,
  nbPages: 0,
  setNbPages: () => {},
  page: 1,
  setPage: () => {},
})
export const useAssignmentsContext = () => useContext(AssignmentsContext)

export const initAssignmentsContext = (
  snackbarContext: SnackbarContextType,
  router: any
) => {
  const [firstloaded, setFirstloaded] = useState<boolean>(false)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [filters, setFilters] = useState<Filter>(getInitialFilters())
  const [loading, setLoading] = useState(false)
  const [nbPages, setNbPages] = useState(1)
  const [page, setPage] = useState<number>(getInitialPage())
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
              payload.data.dateDeRendu = new Date(payload.data.dateDeRendu)
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
              push(
                `Assignment ${newAssignments[index].nom} modifié !`,
                'success'
              )
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

  useEffect(() => {
    if (!firstloaded) {
      setFirstloaded(true)
      return
    }
    console.log('update')
    setLoading(true)
    const queries = generateFiltersQueries()

    fetch('/api/assignments' + queries, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        res.json().then((payload) => {
          if (res.status === 200) {
            payload.data.forEach((a: any) => {
              a.dateDeRendu = new Date(a.dateDeRendu)
            })
            setAssignments(payload.data)
            setNbPages(payload.nb_pages)
          } else {
            console.error(payload.message)
            push(`Erreur: ${payload.message}`, 'error')
          }
        })
      })
      .catch((err) => {
        console.error(err)
        push(`Erreur: ${err}`, 'error')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [filters, page])

  function getInitialFilters() {
    const { text, rendu, sort: sort_tring } = router.query

    let model: {
      text: string
      rendu: 'true' | 'false' | 'none'
      sort: GridSortModel
    } = {
      text: '',
      rendu: 'none',
      sort: [],
    }

    if (text) model.text = text as string
    if (rendu) model.rendu = rendu as 'none' | 'true' | 'false'
    if (sort_tring) {
      try {
        let [field, sort] = (sort_tring as string).split('-')
        model.sort.push({ field, sort } as {
          field: string
          sort: GridSortDirection
        })
      } catch (error) {}
    }

    return model
  }

  function getInitialPage() {
    const { page } = router.query
    return page ? +page : 0
  }

  function generateFiltersQueries() {
    let queries = `?page=${page ?? 0}`
    if(filters.text.length) queries += `&text=${filters.text}`
    if(filters.rendu !== 'none') queries += `&rendu=${filters.rendu}`
    if(filters.sort.length) {
      const {field, sort} = filters.sort[0]
      queries += `&sort=${field}-${sort}`
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
    setFilters,
    loading,
    nbPages,
    setNbPages,
    page,
    setPage,
  }
}
