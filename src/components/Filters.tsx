import { ButtonGroup, Button } from '@mui/material'
import styles from '@/styles/Filters.module.scss'
import CloseIcon from '@mui/icons-material/Close'

import { useState, useEffect } from 'react'
import { useAssignmentsContext } from '@/contexts/AssignmentsContext'

type Tri = 'date' | 'nom' | null | undefined
type Rendu = Boolean | null | undefined

export default function Filters() {
  const { setFilters, filters } = useAssignmentsContext()
  const [tri, setTri] = useState<Tri>(defaultTri())
  const [rendu, setRendu] = useState<Rendu>(defaultRendu())
  console.log(filters)

  useEffect(() => {
    if(tri === defaultTri() && rendu === defaultRendu()) return

    const new_filters = []
    if (tri === 'date') new_filters.push('orderby-date')
    if (tri === 'nom') new_filters.push('orderby-alpha')
    if (rendu === true) new_filters.push('rendu')
    if (rendu === false) new_filters.push('non-rendu')

    console.log('ici: ' + new_filters)
    setFilters(new_filters)
  }, [tri, rendu])

  function defaultTri() {
    if (filters === null) return undefined
    if (filters.includes('orderby-date')) return 'date'
    if (filters.includes('orderby-alpha')) return 'nom'
    return undefined
  }

  function defaultRendu() {
    if (filters === null) return undefined
    if (filters.includes('rendu')) return true
    if (filters.includes('non-rendu')) return false
    return undefined
  }

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
        <Button data-active={rendu === true} onClick={() => setRendu(true)}>
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
