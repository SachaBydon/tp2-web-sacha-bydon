import { Assignments } from '@/components'

export async function getServerSideProps(context: any) {
  const { user_status } = context.req.cookies
  console.log(user_status)
  const loggedIn = user_status === 'admin' || user_status === 'user'

  if (!loggedIn) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return { props: {} }
}

export default function Home() {
  return (
    <div id="Home">
      <Assignments />
    </div>
  )
}
