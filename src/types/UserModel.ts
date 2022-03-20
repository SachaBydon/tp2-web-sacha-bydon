import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
  },
})

export default mongoose.models.Users ?? mongoose.model('Users', UserSchema)

export type User = {
  username: string
  password: string
  role: 'user' | 'admin'
}
