import { useAuthContext } from '../contexts/AuthContext'
import { Route, Redirect } from 'react-router-dom'

type Props = {
  children: React.ReactNode
  isProtected?: boolean
  path: string
}

export default function CustomRoute({ children, isProtected, path }: Props) {
  const { loggedIn } = useAuthContext()

  if (path === '/login' && loggedIn) {
    return (
      <Route
        render={({ location }) => (
          <Redirect to={{ pathname: '/', state: { from: location } }} />
        )}
      />
    )
  } else {
    return (
      <Route
        render={({ location }) =>
          loggedIn || !isProtected ? (
            children
          ) : (
            <Redirect to={{ pathname: '/login', state: { from: location } }} />
          )
        }
      />
    )
  }
}
