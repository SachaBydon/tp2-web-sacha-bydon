import Assignment from '@/types/Assignment'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

type Props = {
  deleting: boolean
  setDeleting: (deleting: boolean) => void
  deletingAssignment: Assignment|null
  remove: () => void
}

/**
 * Delete confirmation modal
 * @param props {Props}
 * @returns {JSX.Element}
 */
export default function DeleteModal({
  deleting,
  setDeleting,
  deletingAssignment,
  remove,
}: Props) {
  return (
    <Dialog open={deleting} onClose={() => setDeleting(false)}>
      <DialogTitle>Suppression: {deletingAssignment?.nom}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Êtes-vous sûr de vouloir supprimer cet assignement ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleting(false)}>Annuler</Button>
        <Button onClick={() => remove()} color="error">
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  )
}
