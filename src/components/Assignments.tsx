import { useState, useEffect } from 'react'
import { AssignmentDetail, AssignmentItem, Actions } from '@/components'
import { useAssignmentsContext } from '@/contexts/AssignmentsContext'
import { useAuthContext } from '@/contexts/AuthContext'
import { List, Pagination, IconButton } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useRouter } from 'next/router'
import styles from '@/styles/Assignments.module.scss'
import { destroyCookie } from 'nookies'
import LoopIcon from '@mui/icons-material/Loop'

const ITEMS_PER_PAGE = 20

export default function Assignments() {
  const router = useRouter()

  const titre: string = 'Assignments'

  const { assignments, loading, nbPages, page, setPage } =
    useAssignmentsContext()
  const { username } = useAuthContext()
  const defaultSelected = router.query.id ? router.query.id.toString() : null
  const [selectedId, setSelectedId] = useState<string | null>(defaultSelected)
  const [openModale, setOpenModale] = useState<boolean>(
    defaultSelected !== null
  )
  const defaultPage = router.query.page ? +router.query.page.toString() : 1

  useEffect(() => {
    if (defaultPage !== 1) setPage(+defaultPage)
  }, [])

  function changeSelected(id: string | null) {
    setSelectedId(id)
    setOpenModale(true)
  }

  function pageChanged(e: any, page: number) {
    if (page !== null) setPage(page)
  }

  useEffect(() => {
    updateUrl()
  }, [page, selectedId])

  function updateUrl() {
    const url = new URL(window.location.href)

    if (selectedId !== null) url.searchParams.set('id', selectedId)
    else url.searchParams.delete('id')
    if (page !== null) {
      if (page === 1) url.searchParams.delete('page')
      else url.searchParams.set('page', page.toString())
    }

    const query =
      url.searchParams.toString() !== ''
        ? '/?' + url.searchParams.toString()
        : '/'
    window.history.pushState({ path: query }, '', query)
  }

  return (
    <div className={`${styles.Assignments} ${loading ? styles.loading : ''}`}>
      <AssignmentDetail
        assignmentId={selectedId}
        setSelectedId={setSelectedId}
        open={openModale}
        setModal={setOpenModale}
      />

      <div className={styles.head}>
        <h1>{titre}</h1>
        <div>
          {username}
          <IconButton
            color="error"
            onClick={() => {
              destroyCookie(null, 'user')
              location.reload()
            }}
          >
            <LogoutIcon />
          </IconButton>
        </div>
      </div>
      <Actions />

      <div className={styles.overlay} data-overlay>
        <div
          className={`rotate-animation-svg ${styles.loader} ${
            loading ? '' : styles.hideLoading
          }`}
        >
          <LoopIcon />
        </div>
        <List className={styles.list}>
          {assignments.map((assignment, index) => (
            <AssignmentItem
              key={index}
              assignment={assignment}
              changeSelected={changeSelected}
            />
          ))}
        </List>
      </div>

      <div className={styles.pagination}>
        <Pagination
          count={nbPages}
          onChange={pageChanged}
          defaultPage={defaultPage}
        />
      </div>
    </div>
  )
}
