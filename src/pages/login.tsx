import {
  FormGroup,
  TextField,
  Fab,
  Paper,
  FormHelperText,
  FormControl,
} from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import { LoadingFabButton } from '@/components'
import useForm from '@/hooks/useForm'
import { useAuthContext } from '@/contexts/AuthContext'
import { useState, useRef, useEffect } from 'react'
import Router from 'next/router'
import { login } from '@/pages/api/auth'
import styles from '@/styles/Login.module.scss'

export async function getServerSideProps(context: any) {
  // Get the user from the cookie
  let { user } = context.req.cookies
  user = user ? JSON.parse(user) : undefined
  const res: any = user === undefined ? { logged: false } : await login(user)

  // If the user is logged in, redirect to the home page
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
  // Initialize the form and the state
  const defaultForm = { username: '', password: '' }
  const { formValues, updateForm } = useForm(defaultForm, onFormChange)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthContext()
  const firstInputRef = useRef<HTMLInputElement>(null)

  // Clear the error message when the form is changed
  function onFormChange() {
    setError('')
  }

  // Set the focus on the first input when the page is loaded
  useEffect(() => {
    firstInputRef.current?.focus()
  }, [firstInputRef.current])

  // Handle the login button click
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log(formValues)
    setLoading(true)

    // Try to login
    const authResult: any = await login(formValues)

    // If the login was successful, redirect to the home page
    if (authResult.valid) {
      Router.push('/')
    }
    // If the login was not successful, display an error message
    else {
      setError('Identifiant ou mot de passe incorect')
      setLoading(false)
    }
  }

  return (
    <Paper variant="outlined" className={styles.login}>
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
            inputRef={firstInputRef}
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
          <LoadingFabButton
            text="Se connecter"
            loadingText="Connexion ..."
            disabled={
              !formValues.username.length || !formValues.password.length
            }
            loading={loading}
            icon={<LoginIcon />}
          />
        </FormControl>
      </form>
    </Paper>
  )
}
