import { createContext, useContext } from 'react'

export type AuthContextType = {
  loggedIn: boolean
  admin: boolean
  login: (user: any) => void
}

export const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  admin: false,
  login: () => {},
})
export const useAuthContext = () => useContext(AuthContext)
