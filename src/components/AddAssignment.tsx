import { useRef, useState, useEffect } from 'react'
import { FormGroup, TextField, Fab } from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import frLocale from 'date-fns/locale/fr'
import DatePicker from '@mui/lab/DatePicker'
import { useAssignmentsContext } from '@/contexts/AssignmentsContext'
import AddIcon from '@mui/icons-material/Add'
import useForm from '@/hooks/useForm'
import { useAuthContext } from '@/contexts/AuthContext'
import Assignment from '@/types/Assignment'
import { LoadingFabButton } from '@/components'

export default function AddAssignment() {
  const { addAssignment: add } = useAssignmentsContext()
  const firstInputRef: React.RefObject<HTMLInputElement> = useRef(null)

  const defaultFormData = { name: '', date: new Date() }
  const { formValues, updateForm, clearForm, setValue } =
    useForm(defaultFormData)

  const { admin } = useAuthContext()

  const [formVisible, setFormVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: any) {
    e.preventDefault()
    console.log('loading ...')
    setLoading(true)
    await add({
      nom: formValues.name,
      dateDeRendu: formValues.date,
      rendu: false,
    } as Assignment)
    console.log('added !!!')
    setLoading(false)
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
    <div id="AddAssignment" className={formVisible ? 'add-open' : ''}>
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
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
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
          <LoadingFabButton
            text="Ajouter un devoir"
            loadingText="Ajout du devoir ..."
            disabled={!formValues.name.length || formValues.date === null}
            loading={loading}
            icon={<AddIcon />}
          />
        </FormGroup>
      </form>
      <div className={formVisible ? 'hide' : ''}>
        <Fab
          color="primary"
          onClick={() => setFormVisible(true)}
          disabled={!admin}
        >
          <AddIcon />
        </Fab>
      </div>
    </div>
  )
}
