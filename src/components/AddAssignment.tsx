import { useRef, useState, useEffect } from 'react'
import { FormGroup, TextField } from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import frLocale from 'date-fns/locale/fr'
import DatePicker from '@mui/lab/DatePicker'
import { useAssignmentsContext } from '@/contexts/AssignmentsContext'
import AddIcon from '@mui/icons-material/Add'
import useForm from '@/hooks/useForm'
import Assignment from '@/types/Assignment'
import { LoadingFabButton } from '@/components'
import styles from '@/styles/AddAssignment.module.scss'

/**
 * Form to add an assignment
 * @returns {JSX.Element}
 */
export default function AddAssignment() {
  const { addAssignment: add } = useAssignmentsContext()
  const firstInputRef: React.RefObject<HTMLInputElement> = useRef(null)

  const defaultFormData = { name: '', date: new Date() }
  const { formValues, updateForm, clearForm, setValue } =
    useForm(defaultFormData)


  const [loading, setLoading] = useState(false)

  async function onSubmit(e: any) {
    e.preventDefault()
    setLoading(true)
    await add({
      nom: formValues.name,
      dateDeRendu: formValues.date,
      rendu: false,
    } as Assignment)
    setLoading(false)
    clearForm()
  }

  useEffect(() => {
    firstInputRef.current?.focus()
  }, [])

  return (
    <div id="AddAssignment">
      <form onSubmit={onSubmit} className={styles.form}>
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
            className={styles.submit}
          />
        </FormGroup>
      </form>
    </div>
  )
}
