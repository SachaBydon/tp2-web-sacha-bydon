import dbConnect from '@/lib/dbConnect'
import Assignment from '@/types/Assignment'
import Assignments from '@/types/AssignmentModel'
import type { NextApiRequest, NextApiResponse } from 'next'
import rawdata from './data'

const PAGE_SIZE = 20
type ResultType = {
  data?: Assignment[]
  nb_pages?: number
  error?: any
  message?: string
}

// Get all assignments by page and filters
async function getAssignments(req: NextApiRequest, res: NextApiResponse) {
  
  const { query, sort, page } = getFormatedFilters(req.query)

  // Get the data
  const result: ResultType = await getAssignmentsByFilters(query, sort, page)
  if (result.error) {
    console.error(result.error)
    return res
      .status(500)
      .json({ message: result.message, error: result.error })
  } else {
    return res.status(200).json(result)
  }
}

// Create an assignment (req.body => Assignment type)
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

// Update an assignment by id (req.query.id)
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

// Delete an assignment by id (req.query.id)
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

// Assignments router
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Database connection
  await dbConnect()

  // execute the right function depending on the request
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

// Add a lot of data to the database with the data.ts file
export async function addALotOffAssignments() {
  // Database connection
  await dbConnect()

  // Filter data
  const assignments: any[] = rawdata
  for (const i in assignments) {
    assignments[i].dateDeRendu = new Date(assignments[i].dateDeRendu['$date'])
  }

  // Add data to the database
  const result = await Assignments.insertMany(assignments)
}

// SSR: Get all assignments by page and filters
export async function getAllAssignments(query_data: any) {
  const { query, sort, page } = getFormatedFilters(query_data)
  await dbConnect()
  return await getAssignmentsByFilters(query, sort, page)
}

function getAssignmentsByFilters(query: any, sort: any, page: number) {
  return new Promise<ResultType>(async (resolve) => {
    try {
      // Get all assignments
      const list = await Assignments.find(query)
        .sort(sort)
        .skip(page * PAGE_SIZE)
        .limit(PAGE_SIZE)
      const count = await Assignments.count(query)

      // Format the data
      const data = list.map((assignment) => {
        return {
          _id: assignment._id.toString(),
          nom: assignment.nom,
          dateDeRendu: assignment.dateDeRendu.toString(),
          rendu: assignment.rendu === 'true' ? true : false,
        }
      })
      // Return the data
      resolve({ data, nb_pages: Math.ceil(count / PAGE_SIZE) })
    } catch (error) {
      console.error(error)
      resolve({ message: 'Error fetching assignment', error })
    }
  })
}

function getFormatedFilters(query_data: any) {
  const page = query_data.page ? +query_data.page : 0

  let query: any = {}
  if (query_data.rendu !== undefined) {
    if (query_data.rendu === 'true') query.rendu = true
    if (query_data.rendu === 'false') query.rendu = false
  }
  if (query_data.text !== undefined) query.nom = {'$regex': query_data.text, '$options' : 'i' } 
  let sort: any = {}
  if (query_data.sort !== undefined) {
    try {
      const [field, sortDir] = query_data.sort.split('-')
      sort[field] = sortDir === 'asc' ? 1 : -1
    } catch (error) {}
  }

  return { query, sort, page }
}