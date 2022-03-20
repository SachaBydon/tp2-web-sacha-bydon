import { Assignments } from '@/components'
import { useAssignmentsContext } from '@/contexts/AssignmentsContext'
import { useAuthContext } from '@/contexts/AuthContext'
import { login } from '@/pages/api/auth'
import { getAllAssignments } from '@/pages/api/assignments'
import { useEffect } from 'react'
import Assignment from '@/types/Assignment'

export async function getServerSideProps(context: any) {
  // Get the user from the cookie
  let { jwt } = context.req.cookies
  const res: any = jwt === undefined ? { logged: false } : await login(jwt)

  let assignments: Assignment[] = []
  let nbPages = 1

  // If the user is not logged in, redirect to the login page
  if (!jwt) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  // If the user is logged in, get the assignments
  else {
    const { data, nb_pages } = await getAllAssignments(context.query)
    assignments = data as Assignment[]
    nbPages = nb_pages as number
  }

  // Return the props to the page component
  return {
    props: {
      admin: res.admin,
      logged: res.logged,
      username: res.username,
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
  // Get the contexts
  const { setAdmin, setLoggedIn, setUsername } = useAuthContext()
  const { setAssignments, setNbPages } = useAssignmentsContext()

  // Set the default data in the contexts
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
