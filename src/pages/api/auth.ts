import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/dbConnect'
import Users from '@/types/UserModel'

// Auth models
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
    return creds.username === this.username && creds.password === this.password
  }
}

// Auth router
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  // Connect to database
  await dbConnect()

  // Get user from database
  const user = new Credentials(req.body)
  const result = await Users.findOne(user)

  // return user status (admin, user or not_logged)
  const user_status: UserStatus = {
    value: result ? result.role : 'not_logged',
  }
  res.status(200).json({ user_status })
}

// SSR: login function
export async function login(user: ICredentials) {
  // Connect to database
  await dbConnect()
  // Get user from database
  const result = await Users.findOne(user)

  // return user status
  return {
    logged: result !== null,
    admin: result?.role === 'admin',
  }
}
