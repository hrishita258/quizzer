import express from 'express'
import postgres from '../../db/Prisma.js'
const router = express.Router()

router.get('/', async (req, res) => {
  const colleges = await postgres.college.findMany({
    include: { specializations: true }
  })
  res.status(200).json({ status: 200, result: colleges })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await postgres.college.findFirst({
      where: {
        id
      },
      include: {
        Users: true,
        quizes: true,
        specializations: true
      }
    })
    res.status(200).json({ status: 200, result })
  } catch (err) {
    console.log(err)
  }
})

export default router
