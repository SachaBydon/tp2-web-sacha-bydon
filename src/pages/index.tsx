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
  let nbPages = 1

  if (!res.logged) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  } else {
    const { data, nb_pages } = await getAllAssignments(context.query)
    assignments = data
    nbPages = nb_pages
  }

  return {
    props: {
      admin: res.admin,
      logged: res.logged,
      username: user?.username,
      assignments,
      nbPages,
    },
  }
}

type Props = {
  admin: boolean
  logged: boolean
  username: string
  assignments: Assignment[]
  nbPages: number
}

export default function Home({
  admin,
  logged,
  username,
  assignments,
  nbPages,
}: Props) {
  const { setAdmin, setLoggedIn, setUsername } = useAuthContext()
  const { setAssignments, setNbPages } = useAssignmentsContext()

  useEffect(() => {
    setAdmin(admin)
    setLoggedIn(logged)
    setUsername(username)
    setNbPages(nbPages)
    assignments.forEach((a) => (a.dateDeRendu = new Date(a.dateDeRendu)))
    setAssignments(assignments)
  }, [])

  return (
    <div id="Home">
      <Assignments />
    </div>
  )
}
