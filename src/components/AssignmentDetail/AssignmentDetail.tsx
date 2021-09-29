import {
  Button,
  Checkbox,
  Modal,
  Box,
  Typography,
  FormControlLabel,
} from '@mui/material'
import { useContextState } from '../../AppContext'

type Props = {
  assignmentIndex: number | null
  open: boolean
  setModal: (open: boolean) => void
}

export default function AssignmentDetail({
  assignmentIndex,
  open,
  setModal,
}: Props) {
  const { assignments, setAssignmentRendu } = useContextState()
  const assignment =
    assignmentIndex !== null ? assignments[assignmentIndex] : null

  function renduChanged(event: any) {
    if (event.target.checked) setAssignmentRendu(assignmentIndex)
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 12,
    p: 4,
    borderRadius: 2,
  }

  return (
    <Modal open={open} onClose={() => setModal(false)}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {assignment?.nom}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          La date de rendu de ce devoir est fixé au {assignment?.dateDeRendu}.
          {!assignment?.rendu && (
            <FormControlLabel
              style={{ display: 'block' }}
              control={<Checkbox onChange={renduChanged} />}
              label="Rendu"
            />
          )}
        </Typography>
        <Button onClick={() => setModal(false)}>Valider</Button>
      </Box>
    </Modal>
  )
}
