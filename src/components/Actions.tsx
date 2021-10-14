import { Fab } from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import styles from '@/styles/Actions.module.scss'
import { useState, useEffect } from 'react'
import { AddAssignment, Filters } from '@/components'
import { useAuthContext } from '@/contexts/AuthContext'
import ClickAwayListener from '@mui/material/ClickAwayListener'

type Action = 'add' | 'filters' | 'none'

export default function Action() {
  const [action, setAction] = useState<Action>('none')

  const { admin } = useAuthContext()

  useEffect(() => {
    function escape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setAction('none')
      }
    }
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('keydown', escape)
    }
  }, [])

  return (
    <ClickAwayListener onClickAway={() => setAction('none')}>
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
    </ClickAwayListener>
  )
}
