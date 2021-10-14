import { useState, useEffect } from 'react'
import { AssignmentDetail, AddAssignment, AssignmentItem } from '@/components'
import { useAssignmentsContext } from '@/contexts/AssignmentsContext'
import { useAuthContext } from '@/contexts/AuthContext'
import { List, Pagination, Fab } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useRouter } from 'next/router'
import styles from '@/styles/Assignments.module.scss'
import { destroyCookie } from 'nookies'
import { style } from '@mui/system'

const ITEMS_PER_PAGE = 10

export default function Assignments() {
  const router = useRouter()

  const titre: string = 'Mon application sur les assignments'

  const { assignments } = useAssignmentsContext()
  const { username } = useAuthContext()
  const defaultSelected = router.query.id ? router.query.id.toString() : null
  const [selectedId, setSelectedId] = useState<string | null>(defaultSelected)
  const [openModale, setOpenModale] = useState<boolean>(
    defaultSelected !== null
  )
  const nbPages = Math.ceil(assignments.length / ITEMS_PER_PAGE)

  const [filteredAssignments, setFilteredAssignments] = useState(
    assignments.slice(0, ITEMS_PER_PAGE)
  )
  const [page, setPage] = useState(1)

  useEffect(() => {
    const newAssignments = assignments.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE
    )
    setFilteredAssignments(newAssignments)
  }, [assignments, page])

  function changeSelected(id: string | undefined) {
    if (id) {
      setSelectedId(id)
      setOpenModale(true)
      window.history.pushState({ path: '/?id=' + id }, '', '/?id=' + id)
    }
  }

  function pageChanged(e: any, page: number) {
    if (page !== null) setPage(page)
  }

  return (
    <div className={styles.Assignments}>
      <AssignmentDetail
        assignmentId={selectedId}
        open={openModale}
        setModal={setOpenModale}
      />

      <div className={styles.head}>
        <h1>{titre}</h1>
        <div>
          {username}
          <Fab
            color="secondary"
            onClick={() => {
              destroyCookie(null, 'user')
              location.reload()
            }}
          >
            <LogoutIcon />
          </Fab>
        </div>
      </div>
      <AddAssignment />

      <div className={styles.overlay} data-overlay>
        <List className={styles.list}>
          {filteredAssignments.map((assignment, index) => (
            <AssignmentItem
              key={index}
              assignment={assignment}
              changeSelected={changeSelected}
            />
          ))}
        </List>
      </div>

      <div className={styles.pagination}>
        <Pagination count={nbPages} onChange={pageChanged} />
      </div>
    </div>
  )
}
