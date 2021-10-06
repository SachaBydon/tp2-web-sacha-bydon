import {
  Button,
  Modal,
  Typography,
  FormControlLabel,
  Card,
  CardContent,
  CardActions,
  Switch,
} from '@mui/material'
import { useAssignmentsContext } from '@/contexts/AssignmentsContext'
import { useState } from 'react'
import LoopIcon from '@mui/icons-material/Loop'
import { useRouter } from 'next/router'

type Props = {
  assignmentId: string | null
  open: boolean
  setModal: (open: boolean) => void
}

export default function AssignmentDetail({
  assignmentId,
  open,
  setModal,
}: Props) {
  const router = useRouter()
  const { assignments, setAssignmentRendu } = useAssignmentsContext()
  const assignment =
    assignmentId !== null
      ? assignments.find((a) => a._id === assignmentId)
      : null

  const [loading, setLoading] = useState(false)

  async function renduChanged(event: any) {
    if (event.target.checked) {
      console.log('loading ...')
      setLoading(true)
      await setAssignmentRendu(assignmentId)
      console.log('rendu !!!')
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        setModal(false)
        router.replace('/')
      }}
    >
      <Card
        className={loading ? 'loading' : ''}
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
        <div className="loader">
          <LoopIcon />
        </div>
        <CardContent>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {assignment?.nom}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {assignment?.rendu ? (
              <>Ce devoir a été rendu le {assignment?.dateDeRendu}.</>
            ) : (
              <>Ce devoir a été rendu le {assignment?.dateDeRendu}.</>
            )}
            <FormControlLabel
              disabled={assignment?.rendu}
              style={{ display: 'block' }}
              control={
                <Switch onChange={renduChanged} checked={assignment?.rendu} />
              }
              label="Rendu"
            />
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
