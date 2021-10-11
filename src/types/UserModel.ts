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
