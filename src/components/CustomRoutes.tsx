import { useAuthContext } from '@/contexts/AuthContext'

type Props = {
  router: any
  children: any
}

const isBrowser = () => typeof window !== 'undefined'

export default function CustomRoute({ router, children }: Props) {
  const { loggedIn } = useAuthContext()

  if (isBrowser()) {
    const authorized = loggedIn || router.pathname === '/login'
    const uselessLogin = loggedIn && router.pathname === '/login'
    if (!authorized) router.push('/login')
    if (uselessLogin) router.push('/')
    const doRender = authorized && !uselessLogin
    return doRender && children
  } else {
    return children
  }
}
