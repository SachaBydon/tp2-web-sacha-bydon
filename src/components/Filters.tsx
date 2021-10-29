import { ButtonGroup, Button } from '@mui/material'
import styles from '@/styles/Filters.module.scss'
import CloseIcon from '@mui/icons-material/Close'

import { useState } from 'react'
import { useAssignmentsContext } from '@/contexts/AssignmentsContext'
import Filter from '@/types/Filter'

type Tri = 'date' | 'alpha' | null | undefined
type Rendu = Boolean | null | undefined

export default function Filters() {
  const { setFilters, filters } = useAssignmentsContext()
  const [tri, setTri] = useState<Tri>(defaultTri())
  const [rendu, setRendu] = useState<Rendu>(defaultRendu())

  function updateUrl(filters: Filter[]) {
    const url = new URL(window.location.href)
    url.searchParams.delete('rendu')
    url.searchParams.delete('orderby')

    for (let filter of filters) {
      switch (filter) {
        case 'non-rendu':
          url.searchParams.set('rendu', 'false')
          break
        case 'rendu':
          url.searchParams.set('rendu', 'true')
          break
        case 'orderby-alpha':
          url.searchParams.set('orderby', 'alpha')
          break
        case 'orderby-date':
          url.searchParams.set('orderby', 'date')
          break
      }

      const query =
        url.searchParams.toString() !== ''
          ? '/?' + url.searchParams.toString()
          : '/'
      window.history.pushState({ path: query }, '', query)
    }
  }

  function defaultTri() {
    if (filters === null) return null
    if (filters.includes('orderby-date')) return 'date'
    if (filters.includes('orderby-alpha')) return 'alpha'
  }

  function defaultRendu() {
    if (filters === null) return null
    if (filters.includes('rendu')) return true
    if (filters.includes('non-rendu')) return false
  }

  function setFilterProperty(name: String, value: any) {
    let new_tri = tri
    let new_rendu = rendu
    switch (name) {
      case 'orderby':
        setTri(value as Tri)
        new_tri = value
        break
      case 'rendu':
        setRendu(value as Rendu)
        new_rendu = value
        break
    }

    const new_filters: Filter[] = []
    if (new_tri === 'date') new_filters.push('orderby-date')
    if (new_tri === 'alpha') new_filters.push('orderby-alpha')
    if (new_rendu === true) new_filters.push('rendu')
    if (new_rendu === false) new_filters.push('non-rendu')

    setFilters(new_filters)
    updateUrl(new_filters)
  }

  return (
    <div className={styles.Filters}>
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button
          data-active={tri === 'date'}
          onClick={() => setFilterProperty('orderby', 'date')}
        >
          Tri par date
        </Button>
        <Button
          data-active={tri === 'alpha'}
          onClick={() => setFilterProperty('orderby', 'alpha')}
        >
          Tri par alpha
        </Button>
        <Button data-close onClick={() => setFilterProperty('orderby', null)}>
          <CloseIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button
          data-active={rendu === true}
          onClick={() => setFilterProperty('rendu', true)}
        >
          Rendu
        </Button>
        <Button
          data-active={rendu === false}
          onClick={() => setFilterProperty('rendu', false)}
        >
          Non rendu
        </Button>
        <Button data-close onClick={() => setFilterProperty('rendu', null)}>
          <CloseIcon />
        </Button>
      </ButtonGroup>
    </div>
  )
}
