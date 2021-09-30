import './AssignmentsStyle.scss'
import { useState } from 'react'
import {
  AssignmentDetail,
  AddAssignment,
  AssignmentItem,
} from '../../components'
import { useContextState } from '../../AppContext'
import { List } from '@mui/material'

export default function Assignments() {
  const titre: string = 'Mon application sur les assignments'

  const { assignments } = useContextState()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [openModale, setOpenModale] = useState<boolean>(false)

  function changeSelected(index: number) {
    setSelectedIndex(index)
    setOpenModale(true)
  }

  return (
    <div className="Assignments">
      <h1>{titre}</h1>
      <AddAssignment />
      <List className="list">
        {assignments.map((assignment, index) => (
          <AssignmentItem
            assignment={assignment}
            index={index}
            key={index}
            changeSelected={changeSelected}
          />
        ))}
      </List>
      <AssignmentDetail
        assignmentIndex={selectedIndex}
        open={openModale}
        setModal={setOpenModale}
      />
    </div>
  )
}
