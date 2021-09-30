import { createContext, useContext } from 'react'
import { useState } from 'react'

export type AuthContextType = {
  loggedIn: boolean
  admin: boolean
  login: (user: any) => void
}

export const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  admin: false,
  login: () => { },
})
export const useAuthContext = () => useContext(AuthContext)

export const initAuthContext = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [admin, setAdmin] = useState<boolean>(false)

  function login(user: any): Promise<{ valid: boolean }> {
    return new Promise<{ valid: boolean }>((resolve) => {
      setTimeout(() => {
        if (user.name === 'admin' && user.password === 'admin') {
          setLoggedIn(true)
          setAdmin(true)
          resolve({ valid: true })
        } else if (user.name === 'user' && user.password === 'user') {
          setLoggedIn(true)
          resolve({ valid: true })
        } else {
          resolve({ valid: false })
        }
      }, 1000)
    })
  }

  return { loggedIn, login, admin }
}