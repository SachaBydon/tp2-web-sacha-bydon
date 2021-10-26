import { Fab } from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import styles from '@/styles/Actions.module.scss'
import { useState } from 'react'
import { AddAssignment, Filters } from '@/components'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'

type Action = 'add' | 'filters' | 'none'

export default function Action() {
  const router = useRouter()
  const [action, setAction] = useState<Action>(getDefaultActions())

  const { admin } = useAuthContext()

  function getDefaultActions() {
    return router.query.orderby || router.query.rendu ? 'filters' : 'none'
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
