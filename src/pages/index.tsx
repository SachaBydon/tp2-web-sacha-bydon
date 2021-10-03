import { Assignments } from '@/components'
import { useAssignmentsContext } from '@/contexts/AssignmentsContext'
import { useAuthContext } from '@/contexts/AuthContext'
import { login } from '@/pages/api/auth'
import { assignments } from '@/pages/api/assignments'
import { useEffect } from 'react'

export async function getServerSideProps(context: any) {
  let { user } = context.req.cookies
  user = user ? JSON.parse(user) : undefined
  const res: any = user === undefined ? { logged: false } : login(user)

  if (!res.logged) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  console.log(assignments)

  return {
    props: {
      admin: res.admin,
      assignments: assignments,
    },
  }
}

export default function Home({ admin, assignments }: any) {
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
