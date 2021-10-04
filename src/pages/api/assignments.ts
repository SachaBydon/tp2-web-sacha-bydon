import dbConnect from '@/lib/dbConnect'
import Assignment from '@/types/Assignment'
import Assignments from '@/types/AssignmentModel'
import type { NextApiRequest, NextApiResponse } from 'next'

export async function getAllAssignments() {
  return new Promise<Assignment[]>(async (resolve) => {
    console.log('connecting ...')

    await dbConnect()
    console.log('connected')
    const result = await Assignments.find({})
    resolve(
      result.map((assignment) => {
        return {
          _id: assignment._id.toString(),
          nom: assignment.nom,
          dateDeRendu: assignment.dateDeRendu,
          rendu: assignment.rendu === 'true' ? true : false,
        }
      })
    )
  })
}

async function addAssignment(req: NextApiRequest, res: NextApiResponse) {
  const newAssignment = new Assignments(req.body as Assignment)
  let data: Assignment
  try {
    data = await newAssignment.save()
    return res.status(200).json({ message: 'Assignment created', data: data })
  } catch (error) {
    return res.status(500).json({ message: 'Error creating assignment', error })
  }
}

async function updateAssignment(req: NextApiRequest, res: NextApiResponse) {
  const updateAssignment = new Assignments(req.body as Assignment)
  let data: Assignment

  try {
    data = await Assignments.findByIdAndUpdate(updateAssignment._id, updateAssignment, { new: true })
    res.status(200).json({
      message: 'Assignment updated',
      data
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error updating assignment',
      error
    })
  }
}

async function deleteAssignment(req: NextApiRequest, res: NextApiResponse) {
  try {
    await Assignments.findByIdAndDelete(req.query.id)
    res.status(200).json({
      message: 'Assignment deleted',
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting assignment',
      error
    })
  }

}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': await addAssignment(req, res); break
    case 'PUT': await updateAssignment(req, res); break
    case 'DELETE': await deleteAssignment(req, res); break
    default: res.status(405).json({ message: 'Method not allowed' })
  }
}


