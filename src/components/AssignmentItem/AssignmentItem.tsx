import Assignment from '../../types/Assignment'
import { useAssignmentsContext } from '../../contexts/AssignmentsContext'
import { useAuthContext } from '../../contexts/AuthContext'
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
import EditIcon from '@mui/icons-material/Edit'
import { green, red } from '@mui/material/colors'

type Props = {
  assignment: Assignment
  index: number
  changeSelected: (i: number) => void
}

export default function AssignmentItem({
  assignment,
  index,
  changeSelected,
}: Props) {
  const { deleteAssignment } = useAssignmentsContext()
  const { admin } = useAuthContext()

  return (
    <ListItem
      key={index}
      secondaryAction={
        <div className="actions">
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={() => changeSelected(index)}
            disabled={!admin}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => deleteAssignment(index)}
            disabled={!admin}
          >
            <DeleteIcon />
          </IconButton>
        </div>
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
  )
}
