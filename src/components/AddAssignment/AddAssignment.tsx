import { useRef, useState, useEffect } from 'react'
import { FormGroup, TextField, Fab } from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import { useContextState } from '../../AppContext'
import './AddAssignmentStyle.scss'
import AddIcon from '@mui/icons-material/Add'

export default function AddAssignment() {
  const { addAssignment: add } = useContextState()
  const firstInputRef = useRef(null)

  type FormData = {
    name: string
    date: Date | null
  }
  const defaultFormData: FormData = {
    name: '',
    date: new Date(),
  }

  const [formValue, setFormValue] = useState<FormData>(defaultFormData)
  const [formVisible, setFormVisible] = useState(false)

  function onSubmit(e: any) {
    e.preventDefault()
    add({
      nom: formValue.name,
      dateDeRendu: formValue.date?.toLocaleDateString() ?? '',
    })
    setFormValue(defaultFormData)
    setFormVisible(false)
  }

  useEffect(() => {
    if (formVisible) firstInputRef.current?.focus()
  }, [formVisible])

  return (
    <div id="AddAssignment">
      <form onSubmit={onSubmit} className={formVisible ? '' : 'hide'}>
        <FormGroup>
          <TextField
            name="name"
            label="Nom"
            inputRef={firstInputRef}
            onChange={(e) =>
              setFormValue({ ...formValue, name: e.target.value })
            }
          />
        </FormGroup>
        <FormGroup>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date de rendu"
              value={formValue.date}
              onChange={(date: Date | null) =>
                setFormValue({ ...formValue, date })
              }
              renderInput={(params) => <TextField {...params} name="date" />}
            />
          </LocalizationProvider>
        </FormGroup>
        <FormGroup>
          {/* <Button
            disabled={!formValue.name.length || formValue.date === null}
            type="submit"
            startIcon={<RiAddCircleLine size="20px" />}
            variant="contained"
            disableElevation
          >
            Ajouter un devoir
          </Button> */}
          <Fab
            color="primary"
            onClick={() => setFormVisible(true)}
            type="submit"
            disabled={!formValue.name.length || formValue.date === null}
            variant="extended"
          >
            <AddIcon />
            Ajouter un devoir
          </Fab>
        </FormGroup>
      </form>
      <div className={formVisible ? 'hide' : ''}>
        <Fab color="primary" onClick={() => setFormVisible(true)}>
          <AddIcon />
        </Fab>
        {/* <Button
          onClick={() => setFormVisible(true)}
          startIcon={<RiAddCircleLine size="20px" />}
          variant="contained"
          disableElevation
        >
          Ajouter un devoir
        </Button> */}
      </div>
    </div>
  )
}
