import { createContext, useContext } from 'react'
import { useState } from 'react'
import { setCookie } from 'nookies'


export type AuthContextType = {
  loggedIn: boolean
  admin: boolean
  login: (user: any) => void
  setAdmin: (admin: boolean) => void
  setLoggedIn: (loggedIn: boolean) => void
}

export const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  admin: false,
  login: () => { },
  setAdmin: () => { },
  setLoggedIn: () => { }
})
export const useAuthContext = () => useContext(AuthContext)

export const initAuthContext = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [admin, setAdmin] = useState<boolean>(false)

  function login(user: any): Promise<{ valid: boolean }> {
    return new Promise<{ valid: boolean }>((resolve) => {
      fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      }).then(async (res) => {
        if (res.status === 200) {
          const data = await res.json()
          const { value: user_status } = data.user_status
          setCookie(null, 'user', JSON.stringify(user), { maxAge: 30 * 24 * 60 * 60, })
          if (user_status === 'admin' || user_status === 'user') {
            setLoggedIn(true)
            setAdmin(user_status === 'admin')
            resolve({ valid: true })
          } else {
            resolve({ valid: false })
          }
        } else {
          resolve({ valid: false })
        }
      }).catch(() => {
        resolve({ valid: false })
      })
    })
  }

  return { loggedIn, login, setLoggedIn, admin, setAdmin }
}
