import mongoose from 'mongoose'

const AssignmentSchema = new mongoose.Schema({
  nom: String,
  dateDeRendu: Date,
  rendu: String,
})

export default mongoose.models.Assignments ?? mongoose.model('Assignments', AssignmentSchema)
