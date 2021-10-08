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
  Popover,
  Button,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import LoopIcon from '@mui/icons-material/Loop'
import { green, red } from '@mui/material/colors'
import { useState, useRef } from 'react'

type Props = {
  assignment: Assignment
  changeSelected: (i: string | undefined) => void
}

export default function AssignmentItem({ assignment, changeSelected }: Props) {
  const { deleteAssignment } = useAssignmentsContext()
  const { admin } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const deleteButtonRef = useRef(null)

  async function remove() {
    if (assignment._id) {
      console.log('loading ...')
      setDeleting(false)
      setLoading(true)
      await deleteAssignment(assignment._id)
      setLoading(false)
      console.log('deleted !!!')
    }
  }

  return (
    <ListItem
      className={loading ? 'loading' : ''}
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
            disabled={!admin}
            ref={deleteButtonRef}
            onClick={() => setDeleting(true)}
          >
            <DeleteIcon />
          </IconButton>
          <Popover
            open={deleting}
            anchorEl={deleteButtonRef.current}
            onClose={() => setDeleting(false)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Button color="error" onClick={() => remove()}>
              Supprimer ?
            </Button>
          </Popover>
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
        secondary={assignment.dateDeRendu.toLocaleDateString()}
      />
    </ListItem>
  )
}
