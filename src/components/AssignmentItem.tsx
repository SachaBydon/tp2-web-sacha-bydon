import Assignment from '@/types/Assignment'
import { useAssignmentsContext } from '@/contexts/AssignmentsContext'
import { useAuthContext } from '@/contexts/AuthContext'
import {
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
import VisibilityIcon from '@mui/icons-material/Visibility'
import LoopIcon from '@mui/icons-material/Loop'
import { green, red } from '@mui/material/colors'
import { useState } from 'react'

type Props = {
  assignment: Assignment
  changeSelected: (i: string | undefined) => void
}

export default function AssignmentItem({
  assignment,
  changeSelected,
}: Props) {
  const { deleteAssignment } = useAssignmentsContext()
  const { admin } = useAuthContext()
  const [loading, setLoading] = useState(false)

  async function remove() {
    if (assignment._id) {
      console.log('loading ...')
      setLoading(true)
      await deleteAssignment(assignment._id)
      setLoading(false)
      console.log('deleted !!!')
    }
  }

  return (
    <ListItem
      className={loading  ? 'loading' : ''}
      secondaryAction={
        <div className="actions">
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={() => changeSelected(assignment._id)}
            disabled={!admin}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => remove()}
            disabled={!admin}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      }
    >
      <div className="loader">
        <LoopIcon />
      </div>
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
  )
}
