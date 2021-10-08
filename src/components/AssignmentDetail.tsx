import {
  Button,
  Modal,
  Typography,
  FormControlLabel,
  Card,
  CardContent,
  CardActions,
  Switch,
  IconButton,
  TextField,
} from '@mui/material'
import { useAssignmentsContext } from '@/contexts/AssignmentsContext'
import { useState, useEffect } from 'react'
import LoopIcon from '@mui/icons-material/Loop'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import useForm from '@/hooks/useForm'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import frLocale from 'date-fns/locale/fr'
import DatePicker from '@mui/lab/DatePicker'
import Assignment from '@/types/Assignment'

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
  const { assignments, updateAssignment } = useAssignmentsContext()
  const [assignment, setAssignment] = useState<Assignment | null>(null)

  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)

  const { formValues, updateForm, setValue, setValues } = useForm({})

  useEffect(() => {
    if (assignmentId && assignments) {
      const defaultAssignment =
        assignmentId !== null
          ? assignments.find((a) => a._id === assignmentId)
          : null

      if (defaultAssignment) {
        setAssignment(defaultAssignment)
        setValues([
          { key: 'rendu', value: defaultAssignment.rendu },
          { key: 'nom', value: defaultAssignment.nom },
          {
            key: 'dateDeRendu',
            value: defaultAssignment.dateDeRendu,
          },
        ])
      }
    }
  }, [assignmentId, assignments])

  function stringToDate(date: string): Date {
    return new Date(date.split('/').reverse().join('/'))
  }

  async function onSubmit(e: any) {
    e.preventDefault()
    console.log(formValues)
    console.log('loading ...')
    setLoading(true)
    const { newAssignment }: any = await updateAssignment(assignmentId, {
      ...formValues,
      // dateDeRendu: formValues.dateDeRendu.toLocaleDateString(),
    })
    console.log(newAssignment)

    console.log('modifié !!!')
    setLoading(false)

    setEditing(false)
  }

  function handleClose() {
    setModal(false)
    setEditing(false)
    window.history.pushState({ path: '/' }, '', '/')
  }

  return (
    <Modal open={open} onClose={handleClose}>
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
        <form onSubmit={onSubmit}>
          <CardContent>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: '16px',
                right: '28px',
              }}
            >
              <CloseIcon />
            </IconButton>
            <div>
              {editing ? (
                <TextField
                  name="nom"
                  value={formValues.nom}
                  size="small"
                  onChange={updateForm}
                  sx={{
                    maxWidth: 'calc(100% - 60px)',
                    width: '100%',
                    marginBottom: '8px',
                  }}
                />
              ) : (
                <h2 style={{ marginTop: 0 }}>{assignment?.nom}</h2>
              )}
            </div>
            <div>
              {editing ? (
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  locale={frLocale}
                >
                  <DatePicker
                    value={formValues.dateDeRendu}
                    InputProps={{ name: 'date' }}
                    onChange={(date) => setValue('dateDeRendu', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="date"
                        size="small"
                        sx={{
                          maxWidth: 'calc(100% - 60px)',
                          width: '100%',
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              ) : assignment?.rendu ? (
                <p>
                  Ce devoir a été rendu le{' '}
                  {assignment?.dateDeRendu?.toLocaleDateString()}.
                </p>
              ) : (
                <p>
                  Ce devoir a été rendu le{' '}
                  {assignment?.dateDeRendu?.toLocaleDateString()}.
                </p>
              )}

              <FormControlLabel
                style={{ display: 'block', marginTop: '8px' }}
                disabled={!editing}
                control={
                  <Switch
                    onChange={(e) => setValue('rendu', e.target.checked)}
                    checked={formValues.rendu ?? false}
                  />
                }
                label="Rendu"
              />
            </div>
          </CardContent>
          <CardActions>
            {editing === true ? (
              <Button
                size="small"
                variant="outlined"
                sx={{ gap: '8px' }}
                color="success"
                onClick={onSubmit}
              >
                <CheckIcon />
                <div style={{ lineHeight: '10px' }}>Valider</div>
              </Button>
            ) : (
              <Button
                size="small"
                variant="outlined"
                sx={{ gap: '8px' }}
                onClick={() => {
                  setEditing(true)
                }}
              >
                <EditIcon />
                <div style={{ lineHeight: '10px' }}>Editer</div>
              </Button>
            )}
          </CardActions>
        </form>
      </Card>
    </Modal>
  )
}
