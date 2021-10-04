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

function addAssignment(req: NextApiRequest, res: NextApiResponse) {
  const newAssignment = new Assignments(req.body as Assignment)
  newAssignment
    .save()
    .then((data: Assignment) => {
      return res.status(200).json({
        message: 'Assignment created',
        data: data
      })
    })
    .catch((err: any) => {
      return res.status(500).json({
        message: 'Error creating assignment',
        error: err,
      })
    })
}

function updateAssignment(req: NextApiRequest, res: NextApiResponse) {
  const updateAssignment = new Assignments(req.body as Assignment)
  Assignments.findByIdAndUpdate(
    updateAssignment._id,
    updateAssignment,
    { new: true },
    (err: any) => {
      if (err) {
        res.status(500).json({
          message: 'Error updating assignment',
          error: err,
        })
      } else {
        res.status(200).json({
          message: 'Assignment updated',
        })
      }
    }
  )
}

function deleteAssignment(req: NextApiRequest, res: NextApiResponse) {
  Assignments.findByIdAndDelete(req.query.id, (err: any) => {
    if (err) {
      res.status(500).json({
        message: 'Error deleting assignment',
        error: err,
      })
    } else {
      res.status(200).json({
        message: 'Assignment deleted',
      })
    }
  })
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': addAssignment(req, res); break
    case 'PUT': updateAssignment(req, res); break
    case 'DELETE': deleteAssignment(req, res); break
    default: res.status(405).json({ message: 'Method not allowed' })
  }
}


