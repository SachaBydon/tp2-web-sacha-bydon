import { Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import styles from '@/styles/Actions.module.scss'
import { useState } from 'react'
import { AddAssignment } from '@/components'
import { useAuthContext } from '@/contexts/AuthContext'

export default function Action() {
  const [adding, setAdding] = useState(false)
  const { admin } = useAuthContext()

  return (
    <div className={styles.Action}>
      {adding ? (
        <div className={styles.line}>
          <AddAssignment />
          <Fab
            color="primary"
            className={`${styles.fab} ${styles.fabCustom}`}
            onClick={() => setAdding(false)}
          >
            <CloseIcon />
          </Fab>
        </div>
      ) : (
        <Fab
          color="primary"
          className={styles.fab}
          disabled={!admin}
          onClick={() => setAdding(true)}
        >
          <AddIcon />
        </Fab>
      )}
    </div>
  )
}
