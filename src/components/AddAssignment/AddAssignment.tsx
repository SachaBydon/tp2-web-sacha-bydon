import { useRef, useState, useEffect } from 'react'
import { FormGroup, TextField, Fab } from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import { useAssignmentsContext } from '../../contexts/AssignmentsContext'
import './AddAssignmentStyle.scss'
import AddIcon from '@mui/icons-material/Add'
import useForm from '../../hooks/useForm'
import { useAuthContext } from '../../contexts/AuthContext'

export default function AddAssignment() {
  const { addAssignment: add } = useAssignmentsContext()
  const firstInputRef: React.RefObject<HTMLInputElement> = useRef(null)

  const defaultFormData = { name: '', date: new Date() }
  const { formValues, updateForm, clearForm, setValue } =
    useForm(defaultFormData)

  const { admin } = useAuthContext()

  const [formVisible, setFormVisible] = useState(false)

  function onSubmit(e: any) {
    e.preventDefault()
    add({
      nom: formValues.name,
      dateDeRendu: formValues.date?.toLocaleDateString() ?? '',
    })
    clearForm()
    setFormVisible(false)
  }

  useEffect(() => {
    if (formVisible) firstInputRef.current?.focus()
  }, [formVisible])

  useEffect(() => {
    function escape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setFormVisible(false)
      }
    }
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('keydown', escape)
    }
  }, [])

  return (
    <div id="AddAssignment">
      <form onSubmit={onSubmit} className={formVisible ? '' : 'hide'}>
        <FormGroup>
          <TextField
            name="name"
            label="Nom"
            inputRef={firstInputRef}
            value={formValues.name}
            onChange={updateForm}
          />
        </FormGroup>
        <FormGroup>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date de rendu"
              value={formValues.date}
              InputProps={{ name: 'date' }}
              onChange={(date) => setValue('date', date)}
              renderInput={(params) => <TextField {...params} name="date" />}
            />
          </LocalizationProvider>
        </FormGroup>
        <FormGroup>
          <Fab
            color="primary"
            onClick={() => setFormVisible(true)}
            type="submit"
            disabled={!formValues.name.length || formValues.date === null}
            variant="extended"
          >
            <AddIcon />
            Ajouter un devoir
          </Fab>
        </FormGroup>
      </form>
      <div className={formVisible ? 'hide' : ''}>
        <Fab color="primary" onClick={() => setFormVisible(true)} disabled={!admin}>
          <AddIcon />
        </Fab>
      </div>
    </div>
  )
}
