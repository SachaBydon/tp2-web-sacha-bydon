import { Fab } from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import styles from '@/styles/Actions.module.scss'
import { useState, useEffect } from 'react'
import { AddAssignment, Filters } from '@/components'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import Filter from '@/types/Filter'
import { useAssignmentsContext } from '@/contexts/AssignmentsContext'

type Action = 'add' | 'filters' | 'none'

export default function Action() {
  const router = useRouter()
  const [action, setAction] = useState<Action>('none')
  const { setFilters } = useAssignmentsContext()
  const { admin } = useAuthContext()

  useEffect(() => {
    initFilters()
  }, [])

  function initFilters() {
    const new_filters: Filter[] = []
    const { rendu, orderby } = router.query
    if (orderby === 'date') new_filters.push('orderby-date')
    if (orderby === 'alpha') new_filters.push('orderby-alpha')
    if (rendu === 'true') new_filters.push('rendu')
    if (rendu === 'false') new_filters.push('non-rendu')
    if (new_filters.length !== 0) {
      setFilters(new_filters)
      setAction('filters')
    }
  }

  return (
    <div className={`${styles.Action} ${action}`}>
      {action === 'none' && (
        <>
          <Fab
            color="primary"
            className={styles.fab}
            disabled={!admin}
            onClick={() => setAction('add')}
          >
            <AddIcon />
          </Fab>
          <Fab
            color="primary"
            className={styles.fab}
            onClick={() => setAction('filters')}
          >
            <FilterAltOutlinedIcon />
          </Fab>
        </>
      )}

      {action === 'add' && (
        <div className={styles.line}>
          <AddAssignment />
          <Fab
            color="primary"
            className={`${styles.fab} ${styles.fabCustom}`}
            onClick={() => setAction('none')}
          >
            <CloseIcon />
          </Fab>
        </div>
      )}

      {action === 'filters' && (
        <>
          <Filters />
          <Fab
            color="primary"
            className={styles.fab}
            onClick={() => setAction('none')}
          >
            <FilterAltIcon />
          </Fab>
        </>
      )}
    </div>
  )
}
