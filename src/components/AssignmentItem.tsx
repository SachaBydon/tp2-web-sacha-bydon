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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import LoopIcon from '@mui/icons-material/Loop'
import { green, red } from '@mui/material/colors'
import { useState, useRef } from 'react'
import styles from '@/styles/AssignmentItem.module.scss'

type Props = {
  assignment: Assignment
  changeSelected: (i: string | null) => void
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
      className={loading ? styles.loading : ''}
      secondaryAction={
        <div className={styles.actions}>
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
          <Dialog open={deleting} onClose={() => setDeleting(false)}>
            <DialogTitle>Suppresion: {assignment.nom}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Êtes-vous sûr de vouloir supprimer cet assignment ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleting(false)}>Annuler</Button>
              <Button onClick={() => remove()} color="error">
                Supprimer
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      }
    >
      <div className={`rotate-animation-svg ${styles.loader}`}>
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
