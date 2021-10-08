import dbConnect from '@/lib/dbConnect'
import Assignment from '@/types/Assignment'
import Assignments from '@/types/AssignmentModel'
import type { NextApiRequest, NextApiResponse } from 'next'
import rawdata from './data'

export async function getAllAssignments() {
  return new Promise<Assignment[]>(async (resolve) => {
    await dbConnect()
    const result = await Assignments.find({})
    resolve(
      result.map((assignment) => {
        return {
          _id: assignment._id.toString(),
          nom: assignment.nom,
          dateDeRendu: assignment.dateDeRendu.toString(),
          rendu: assignment.rendu === 'true' ? true : false,
        }
      })
    )
  })
}

async function getAssignments(req: NextApiRequest, res: NextApiResponse) {
  const query: any = {}
  if (req.query['rendu'] !== undefined) query.rendu = true
  else if (req.query['non-rendu'] !== undefined) query.rendu = false
  console.log(query)
  const sort: any = {
    date: req.query['orderby-date'] ? 1 : 0,
    nom: req.query['orderby-alpha'] ? 1 : 0,
  }
  console.log(sort)

  try {
    const result = await Assignments.find(query).sort(sort)
    const data = result.map((assignment) => {
      return {
        _id: assignment._id.toString(),
        nom: assignment.nom,
        dateDeRendu: assignment.dateDeRendu.toString(),
        rendu: assignment.rendu === 'true' ? true : false,
      }
    })
    console.log(data)
    return res.status(200).json({ data })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error fetching assignment', error })
  }
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
    data = await Assignments.findByIdAndUpdate(
      updateAssignment._id,
      updateAssignment,
      { new: true }
    )
    res.status(200).json({
      message: 'Assignment updated',
      data,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error updating assignment',
      error,
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
      error,
    })
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('connecting ...')
  await dbConnect()
  console.log('connected')

  switch (req.method) {
    case 'GET':
      await getAssignments(req, res)
      break
    case 'POST':
      await addAssignment(req, res)
      break
    case 'PUT':
      await updateAssignment(req, res)
      break
    case 'DELETE':
      await deleteAssignment(req, res)
      break
    default:
      res.status(405).json({ message: 'Method not allowed' })
  }
}

export async function addALotOffAssignments() {
  console.log('connecting ...')
  await dbConnect()
  console.log('connected')

  const assignments: any[] = rawdata
  for (const i in assignments) {
    assignments[i].dateDeRendu = new Date(assignments[i].dateDeRendu['$date'])
  }

  const result = await Assignments.insertMany(assignments)
  console.log(result)
}
