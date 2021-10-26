import { ButtonGroup, Button } from '@mui/material'
import styles from '@/styles/Filters.module.scss'
import CloseIcon from '@mui/icons-material/Close'
import { useRouter } from 'next/router'

import { useState, useEffect } from 'react'
import { useAssignmentsContext } from '@/contexts/AssignmentsContext'
import Filter from '@/types/Filter'

type Tri = 'date' | 'alpha' | null | undefined
type Rendu = Boolean | null | undefined

// TODO réparer
export default function Filters() {
  const router = useRouter()
  const { setFilters, filters } = useAssignmentsContext()
  const [tri, setTri] = useState<Tri>(defaultTri())
  const [rendu, setRendu] = useState<Rendu>(defaultRendu())

  useEffect(() => {
    
    // console.log(tri);
    // console.log(router.query.orderby);
    
    // if (tri === undefined && rendu == undefined) return
    if (tri == router.query.orderby && rendu == router.query.rendu) return

    console.log('changement');
    const new_filters: Filter[] = []
    if (tri === 'date') new_filters.push('orderby-date')
    if (tri === 'alpha') new_filters.push('orderby-alpha')
    if (rendu === true) new_filters.push('rendu')
    if (rendu === false) new_filters.push('non-rendu')

    setFilters(new_filters)
    updateUrl(new_filters)
  }, [tri, rendu])


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
    if (filters === null) return undefined
    // if (filters.includes('orderby-date')) return 'date'
    // if (filters.includes('orderby-alpha')) return 'alpha'
    console.log(router.query.orderby)
    console.log(router.query.orderby?.toString())
    return (router.query.orderby ?? undefined) as Tri
  }

  function defaultRendu() {
    if (filters === null) return undefined
    // if (filters.includes('rendu')) return true
    // if (filters.includes('non-rendu')) return false
    // console.log(router.query.rendu)
    // console.log(router.query.rendu?.toString())
    return (router.query.rendu?.toString() ?? undefined) as Rendu
  }

  return (
    <div className={styles.Filters}>
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button data-active={tri === 'date'} onClick={() => setTri('date')}>
          Tri par date
        </Button>
        <Button data-active={tri === 'alpha'} onClick={() => setTri('alpha')}>
          Tri par alpha
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
