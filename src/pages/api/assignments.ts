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
          dateDeRendu: assignment.dateDeRendu,
          rendu: assignment.rendu === 'true' ? true : false,
        }
      })
    )
  })
}

async function getAssignments(req: NextApiRequest, res: NextApiResponse) {
  const query: any = {}
  if(req.query['rendu'] !== undefined) query.rendu = true
  else if(req.query['non-rendu'] !== undefined) query.rendu = false
  else query.rendu = ''

  console.log(query)
  const sort: any = {
    date: req.query['orderby-date'] ? 1 : 0,
    nom: req.query['orderby-alpha'] ? 1 : 0,
  }

  try {
    const result = await Assignments.find(query).sort(sort)
    // .aggregate([
    //   {
    //     $project: {
    //       date: {
    //         $dateFromString: {
    //           dateString: '$dateDeRendu',
    //           format: '%d/%m/%Y',
    //         },
    //       },
    //       nom: 1,
    //       rendu: 1,
    //       dateDeRendu: 1,
    //     },
    //     // $sort: {
    //     //   date: req.query['orderby-date'] ? 1 : 0,
    //     //   nom: req.query['orderby-alpha'] ? 1 : 0,
    //     // },
    //     // $match: {
    //     //   rendu:
    //     // },
    //     $match: Assignments.where('rendu').equals(true),
    //   },
    // ])

    

    const data = result.map((assignment) => {
      return {
        _id: assignment._id.toString(),
        nom: assignment.nom,
        // dateDeRendu: assignment.dateDeRendu,
        dateDeRendu: new Date(assignment.dateDeRendu),
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
  

  for(const a of rawdata) {
    a.dateDeRendu = new Date(a.dateDeRendu)
  }


  const result = await Assignments.insertMany(rawdata)
  console.log(result)
  
}
