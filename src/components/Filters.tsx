import { ButtonGroup, Button } from '@mui/material'
import styles from '@/styles/Filters.module.scss'
import CloseIcon from '@mui/icons-material/Close'

import { useState, useEffect } from 'react'

type Tri = 'date' | 'nom' | null
type Rendu = Boolean | null

export default function Filters() {
  const [tri, setTri] = useState<Tri>(null)
  const [rendu, setRendu] = useState<Rendu>(null)

  useEffect(() => {
    console.log('update list')
  }, [tri, rendu])

  return (
    <div className={styles.Filters}>
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button data-active={tri === 'date'} onClick={() => setTri('date')}>
          Tri par date
        </Button>
        <Button data-active={tri === 'nom'} onClick={() => setTri('nom')}>
          Tri par nom
        </Button>
        <Button data-close onClick={() => setTri(null)}>
          <CloseIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button
          data-active={rendu === true}
          onClick={() => setRendu(true)}
        >
          Rendu
        </Button>
        <Button data-active={rendu === false} onClick={() => setRendu(false)}>
          Non rendu
        </Button>
        <Button data-close onClick={() => setRendu(null)}>
          <CloseIcon />
        </Button>
      </ButtonGroup>
    </div>
  )
}
