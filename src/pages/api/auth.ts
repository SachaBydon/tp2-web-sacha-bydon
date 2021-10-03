import type { NextApiRequest, NextApiResponse } from 'next'
import Login from '../login'

interface ICredentials {
  username: string
  password: string
}

type UserStatus = {
  value: 'admin' | 'user' | 'not_logged'
}

class Credentials implements ICredentials {

  username: string
  password: string

  constructor(cred: ICredentials) {
    this.username = cred.username
    this.password = cred.password
  }

  equals(creds: Credentials) {
    return creds.username === this.username
      && creds.password === this.password
  }
}

const ADMIN_CREDS: Credentials = new Credentials({
  username: 'admin',
  password: 'alligator'
})
const USER_CREDS: Credentials = new Credentials({
  username: 'user',
  password: 'langouste'
})

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const provided_creds = new Credentials(req.body as ICredentials)

  let user_status: UserStatus
  if (provided_creds.equals(USER_CREDS)) user_status = { value: 'user' }
  else if (provided_creds.equals(ADMIN_CREDS)) user_status = { value: 'admin' }
  else user_status = { value: 'not_logged' }

  console.log(provided_creds);

  console.log(user_status)
  res.status(200).json({ user_status })
}



export function login(user: ICredentials) {
  console.log('function login /api/auth.ts')
  
  const creds = new Credentials(user)
  return {
    logged: (creds.equals(USER_CREDS) || creds.equals(ADMIN_CREDS)),
    admin: creds.equals(ADMIN_CREDS)
  }
}