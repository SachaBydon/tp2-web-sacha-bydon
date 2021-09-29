import { useEffect, useState } from 'react'
import { Button, FormGroup, TextField } from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import { RiAddCircleLine } from 'react-icons/ri'
import { useContextState } from '../../AppContext'
import './AddAssignmentStyle.scss'

export default function AddAssignment() {
  const { addAssignment: add } = useContextState()

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

  return (
    <div id="AddAssignment">
      {formVisible ? (
        <form onSubmit={onSubmit}>
          <FormGroup>
            <TextField
              name="name"
              label="Nom"
              size="small"
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
            <Button
              disabled={!formValue.name.length || formValue.date === null}
              type="submit"
              startIcon={<RiAddCircleLine size="20px" />}
              variant="contained"
              disableElevation
            >
              Ajouter un devoir
            </Button>
          </FormGroup>
        </form>
      ) : (
        <div>
          <Button
            onClick={() => setFormVisible(true)}
            startIcon={<RiAddCircleLine size="20px" />}
            variant="contained"
            disableElevation
          >
            Ajouter un devoir
          </Button>
        </div>
      )}
    </div>
  )
}
