import { createContext, useContext } from 'react'
import { useState } from 'react'
import { setCookie } from 'nookies'

export type AuthContextType = {
  loggedIn: boolean
  admin: boolean
  username: string
  login: (user: any) => void
  setAdmin: (admin: boolean) => void
  setLoggedIn: (loggedIn: boolean) => void
  setUsername: (username: string) => void
}

export const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  admin: false,
  username: '',
  login: () => {},
  setAdmin: () => {},
  setLoggedIn: () => {},
  setUsername: () => {},
})
export const useAuthContext = () => useContext(AuthContext)

export const initAuthContext = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [admin, setAdmin] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [jwt, setJWT] = useState<string>('')

  function login(user: any): Promise<{ valid: boolean }> {
    return new Promise<{ valid: boolean }>((resolve) => {
      fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })
        .then(async (res) => {
          if (res.status === 200) {
            const data = await res.json()
            const { value: user_status, token } = data.user_status
            setCookie(null, 'jwt', token, { maxAge: 3600 })
            if (user_status === 'admin' || user_status === 'user') {
              setLoggedIn(true)
              setAdmin(user_status === 'admin')
              setUsername(user.username)
              setJWT(token)
              resolve({ valid: true })
            } else {
              resolve({ valid: false })
            }
          } else {
            resolve({ valid: false })
          }
        })
        .catch(() => {
          resolve({ valid: false })
        })
    })
  }

  return {
    loggedIn,
    login,
    setLoggedIn,
    admin,
    setAdmin,
    username,
    setUsername,
  }
}
