import pkg from '@prisma/client'
import express from 'express'
import postgres from '../../db/Prisma.js'

const router = express.Router()
const { Prisma } = pkg
router.get('/', async (req, res) => {
  const users = await postgres.user.findMany({
    select: {
      _count: true,
      role: true,
      id: true,
      College: {
        select: {
          name: true,
          id: true
        }
      },
      specialization: {
        select: {
          name: true,
          id: true
        }
      },
      contactNumber: true,
      createdAt: true,
      email: true,
      name: true,
      enrollmentYear: true,
      gender: true,
      isActive: true,
      semester: true
    }
  })
  if (!users.length)
    return res
      .status(200)
      .json({ status: 200, msg: 'no users found', result: null })

  res.status(200).json({ status: 200, msg: 'no users found', result: users })
})

router.post('/', async (req, res) => {
  const data = req.body
  try {
    if (!data)
      return res.json({
        message: 'values not provided',
        status: '400',
        error: 'bad input'
      })
    const result = await postgres.user.create({
      data: {
        ...data,
        password: '$2a$10$4PnzYJu8ZUNSZ0jLlojPkOz8yBGwW36BU42rhXjaWCCKiaM04nd4a'
      }
    })
    res.json({ status: 200, result })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        res.json({
          status: 400,
          error: e.meta.target.map(
            field => 'a new user cannot be created with this ' + field
          )
        })
      }
    }
  }
})

export default router
