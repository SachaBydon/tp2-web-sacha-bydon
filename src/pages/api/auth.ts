import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/dbConnect'
import Users from '@/types/UserModel'

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  await dbConnect()
  const user = new Credentials(req.body)
  const result = await Users.findOne(user)

  const user_status: UserStatus = {
    value: result ? result.role : 'not_logged',
  }
  res.status(200).json({ user_status })
}

export async function login(user: ICredentials) {
  await dbConnect()
  const result = await Users.findOne(user)

  return {
    logged: result !== null,
    admin: result?.role === 'admin',
  }
}
