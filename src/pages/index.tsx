import { Assignments } from '@/components'
import { useAssignmentsContext } from '@/contexts/AssignmentsContext'
import { useAuthContext } from '@/contexts/AuthContext'
import { login } from '@/pages/api/auth'
// import { assignments } from '@/pages/api/assignments'
import { getAllAssignments } from '@/pages/api/assignments'
import { useEffect } from 'react'
import Assignment from '@/types/Assignment'

export async function getServerSideProps(context: any) {
  let { user } = context.req.cookies
  user = user ? JSON.parse(user) : undefined
  const res: any = user === undefined ? { logged: false } : login(user)
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
      assignments,
    },
  }
}

type Props = {
  admin: boolean
  assignments: Assignment[]
}

export default function Home({ admin, assignments }: Props) {
  const { setAdmin } = useAuthContext()
  const { setAssignments } = useAssignmentsContext()

  useEffect(() => {
    setAdmin(admin)
    setAssignments(assignments)
  }, [])

  return (
    <div id="Home">
      <Assignments />
    </div>
  )
}
