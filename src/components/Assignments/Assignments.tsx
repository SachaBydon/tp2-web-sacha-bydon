import './AssignmentsStyle.scss'
import { RiCheckboxCircleLine, RiCloseCircleLine } from 'react-icons/ri'
import { useState } from 'react'
import { AssignmentDetail, AddAssignment } from '../../components'
import { useContextState } from '../../AppContext'

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
      {assignments?.map((assignment, index) => {
        return (
          <div
            key={index}
            style={{ color: assignment.rendu ? 'green' : 'red' }}
            className={
              assignment.rendu ? 'assignment-rendu' : 'assignment-non-rendu'
            }
            onClick={() => changeSelected(index)}
          >
            {assignment.rendu ? (
              <p>
                <RiCheckboxCircleLine size="20px" />
                <span>
                  Devoir intitulé {assignment.nom}, rendu le{' '}
                  {assignment.dateDeRendu}
                </span>
              </p>
            ) : (
              <p>
                <RiCloseCircleLine size="20px" />
                <span>Le devoir {assignment.nom} n'a pas été rendu</span>
              </p>
            )}
          </div>
        )
      })}
      <AssignmentDetail
        assignmentIndex={selectedIndex}
        open={openModale}
        setModal={setOpenModale}
      />
    </div>
  )
}
