import { useState, useEffect } from 'react'
import { AssignmentDetail, AddAssignment, AssignmentItem } from '@/components'
import { useAssignmentsContext } from '@/contexts/AssignmentsContext'
import { List, Pagination } from '@mui/material'
import { useRouter } from 'next/router'

const ITEMS_PER_PAGE = 10


export default function Assignments() {

  const router = useRouter()
  
  const titre: string = 'Mon application sur les assignments'
  
  const { assignments } = useAssignmentsContext()
  const defaultSelected = router.query.id ? router.query.id.toString() : null
  const [selectedId, setSelectedId] = useState<string | null>(defaultSelected)
  const [openModale, setOpenModale] = useState<boolean>(defaultSelected !== null)
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
      router.replace('/?id='+id)
    }
  }

  function pageChanged(e: any, page: number) {
    if (page !== null) setPage(page)
  }

  return (
    <div className="Assignments">
      <AssignmentDetail
        assignmentId={selectedId}
        open={openModale}
        setModal={setOpenModale}
      />

      <h1>{titre}</h1>
      <AddAssignment />

      <List className="list">
        {filteredAssignments.map((assignment, index) => (
          <AssignmentItem
            key={index}
            assignment={assignment}
            changeSelected={changeSelected}
          />
        ))}
      </List>
      <div className="pagination">
        <Pagination count={nbPages} onChange={pageChanged} />
      </div>
    </div>
  )
}
