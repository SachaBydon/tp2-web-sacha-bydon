import {
  FormGroup,
  TextField,
  Fab,
  Paper,
  FormHelperText,
  FormControl,
} from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import LoopIcon from '@mui/icons-material/Loop'
import './LoginStyle.scss'
import useForm from '@/hooks/useForm'
import { useAuthContext } from '@/contexts/AuthContext'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'

export default function Login() {
  const defaultForm = { name: '', password: '' }
  const { formValues, updateForm } = useForm(defaultForm, onFormChange)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthContext()
  const history = useHistory()

  function onFormChange() {
    setError('')
  }
  
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log(formValues)
    setLoading(true)

    const authResult: any = await login(formValues)
    setLoading(false)
    if (authResult.valid) {
      history.push('/')
    } else {
      setError('Identifiant ou mot de passe incorect')
    }
  }

  return (
    <Paper variant="outlined" id="Login">
      <h1>Connexion</h1>
      <form onSubmit={onSubmit}>
        <FormGroup>
          <TextField
            name="name"
            label="Nom"
            size="small"
            value={formValues.name}
            onChange={updateForm}
            autoFocus
          />
        </FormGroup>
        <FormGroup>
          <TextField
            name="password"
            label="Mot de passe"
            size="small"
            type="password"
            value={formValues.password}
            onChange={updateForm}
          />
        </FormGroup>

        <FormControl error={error !== null}>
          <FormHelperText id="component-error-text">{error}</FormHelperText>
          <Fab
            color="primary"
            type="submit"
            disabled={
              !formValues.name.length || !formValues.password.length || loading
            }
            variant="extended"
          >
            {loading ? (
              <>
                <LoopIcon className="rotate-animation" />
                Connexion ...
              </>
            ) : (
              <>
                <LoginIcon />
                Se connecter
              </>
            )}
          </Fab>
        </FormControl>
      </form>
    </Paper>
  )
}
