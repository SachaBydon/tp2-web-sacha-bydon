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
import { login } from '@/pages/api/auth'

export async function getServerSideProps(context: any) {
  let { user } = context.req.cookies
  user = user ? JSON.parse(user) : undefined
  const res: any = user === undefined ? { logged: false } : login(user)

  if (res.logged) {
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
    if (authResult.valid) {
      Router.push('/')
    } else {
      setError('Identifiant ou mot de passe incorect')
      setLoading(false)
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
