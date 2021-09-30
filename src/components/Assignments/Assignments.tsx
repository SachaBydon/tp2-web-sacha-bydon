import './AssignmentsStyle.scss'
import { useState } from 'react'
import { AssignmentDetail, AddAssignment } from '../../components'
import { useContextState } from '../../AppContext'
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Tooltip,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import { green, red } from '@mui/material/colors'

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
      <List>
        {assignments.map((assignment, index) => (
          <ListItem
            key={index}
            button
            disableRipple
            onClick={() => changeSelected(index)}
            secondaryAction={
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemAvatar>
              {assignment.rendu ? (
                <Tooltip title="Rendu" placement="left" arrow>
                  <Avatar sx={{ bgcolor: green[400] }}>
                    <CheckIcon />
                  </Avatar>
                </Tooltip>
              ) : (
                <Tooltip title="Non rendu" placement="left" arrow>
                  <Avatar sx={{ bgcolor: red[400] }}>
                    <CloseIcon />
                  </Avatar>
                </Tooltip>
              )}
            </ListItemAvatar>
            <ListItemText
              primary={assignment.nom}
              secondary={assignment.dateDeRendu}
            />
          </ListItem>
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
