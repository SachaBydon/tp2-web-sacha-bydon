import {
  Button,
  Checkbox,
  Modal,
  Typography,
  FormControlLabel,
  Card,
  CardContent,
  CardActions,
} from '@mui/material'
import { useAssignmentsContext } from '@/contexts/AssignmentsContext'

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
  const { assignments, setAssignmentRendu } = useAssignmentsContext()
  const assignment =
    assignmentIndex !== null ? assignments[assignmentIndex] : null

  function renduChanged(event: any) {
    if (event.target.checked) setAssignmentRendu(assignmentIndex)
  }

  return (
    <Modal open={open} onClose={() => setModal(false)}>
      <Card
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'calc(100% - 64px)',
          maxWidth: '400px',
          outline: 'none',
          backgroundColor: 'var(--background)',
        }}
      >
        <CardContent>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {assignment?.nom}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {assignment?.rendu ? (
              <>Ce devoir a été rendu le {assignment?.dateDeRendu}.</>
            ) : (
              <>
                La date de rendu de ce devoir est fixé au{' '}
                {assignment?.dateDeRendu}.
                <FormControlLabel
                  style={{ display: 'block' }}
                  control={<Checkbox onChange={renduChanged} />}
                  label="Rendu"
                />
              </>
            )}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => setModal(false)}>
            Valider
          </Button>
        </CardActions>
      </Card>
    </Modal>
  )
}
