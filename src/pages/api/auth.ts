import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/dbConnect'
import Users, { User } from '@/types/UserModel'
const jwt = require("jsonwebtoken")

// Auth models
interface ICredentials {
  username: string
  password: string
}
type UserStatus = {
  value: 'admin' | 'user' | 'not_logged'
  token: string
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

const JWT_KEY = 'abcdef'
const JWT_EXPIRY = 3600 // 1h


// Auth router
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  // Connect to database
  await dbConnect()

  // Get user from database
  const user = new Credentials(req.body)
  const result = await Users.findOne(user) as User|null
  let token
  if(result) {
    token = jwt.sign({ user }, JWT_KEY, {
      algorithm: "HS256",
      expiresIn: JWT_EXPIRY,
    })
  }
  

  // return user status (admin, user or not_logged)
  const user_status: UserStatus = {
    value: result ? result.role : 'not_logged',
    token
  }
  res.status(200).json({ user_status })
}


// SSR: login function
export async function login(token: string) {
  // Connect to database
  await dbConnect()
  // Get user from database

  //decode jwt
  let payload
  try {
    payload = jwt.verify(token, JWT_KEY)
  } catch (error) {
    return { logged: false }
  }
  
  const result = await Users.findOne(payload.user)

  // return user status
  return {
    logged: result !== null,
    admin: result?.role === 'admin',
    username: payload.user.username
  }
}
