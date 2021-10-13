import { Assignments } from '@/components'
import { useAssignmentsContext } from '@/contexts/AssignmentsContext'
import { useAuthContext } from '@/contexts/AuthContext'
import { login } from '@/pages/api/auth'
import { getAllAssignments } from '@/pages/api/assignments'
import { useEffect } from 'react'
import Assignment from '@/types/Assignment'

export async function getServerSideProps(context: any) {
  let { user } = context.req.cookies
  user = user ? JSON.parse(user) : undefined
  const res: any = user === undefined ? { logged: false } : await login(user)
  let assignments: Assignment[] = []

  if (!res.logged) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  } else {
    assignments = await getAllAssignments()
  }

  return {
    props: {
      admin: res.admin,
      logged: res.logged,
      username: user?.username,
      assignments,
    },
  }
}

type Props = {
  admin: boolean
  logged: boolean
  username: string
  assignments: Assignment[]
}

export default function Home({ admin, logged, username, assignments }: Props) {
  const { setAdmin, setLoggedIn, setUsername } = useAuthContext()
  const { setAssignments } = useAssignmentsContext()

  useEffect(() => {
    setAdmin(admin)
    setLoggedIn(logged)
    setUsername(username)
    assignments.forEach((a) => (a.dateDeRendu = new Date(a.dateDeRendu)))
    setAssignments(assignments)
  }, [])

  return (
    <div id="Home">
      <Assignments />
    </div>
  )
}
