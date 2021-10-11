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

  // console.log('connecting ...')
  await dbConnect()
  // console.log('connected')

  const user = new Credentials(req.body)
  const result = await Users.findOne(user)
  // console.log('result: ' + result)

  const user_status: UserStatus = {
    value: result ? result.role : 'not_logged',
  }
  res.status(200).json({ user_status })
}

export async function login(user: ICredentials) {
  // console.log('connecting ...')
  await dbConnect()
  // console.log('connected')

  const result = await Users.findOne(user)
  // console.log('result: ' + result)

  return {
    logged: result !== null,
    admin: result?.role === 'admin',
  }
}
