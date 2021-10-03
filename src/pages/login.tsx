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
import useForm from '@/hooks/useForm'
import { useAuthContext } from '@/contexts/AuthContext'
import { useState } from 'react'
import Router from 'next/router'

export async function getServerSideProps(context: any) {
  const { user_status } = context.req.cookies
  console.log(user_status)
  const loggedIn = user_status === 'admin' || user_status === 'user'

  if (loggedIn) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return { props: {} }
}

export default function Login() {
  const defaultForm = { username: '', password: '' }
  const { formValues, updateForm } = useForm(defaultForm, onFormChange)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthContext()

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
      Router.push('/')
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
            name="username"
            label="Nom"
            size="small"
            value={formValues.username}
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
              !formValues.username.length ||
              !formValues.password.length ||
              loading
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
