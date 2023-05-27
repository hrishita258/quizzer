import express from 'express'
import puppeteer from 'puppeteer'
import postgres from '../../db/Prisma.js'

const router = express.Router()

router.get('/', async (req, res) => {
  console.log(req.query)
  const page = req.query.page || 1
  const itemsPerPage = parseInt(req.query.itemsPerPage || 25)
  let skip = (page - 1) * itemsPerPage
  let query = req.query

  delete query.page
  delete query.itemsPerPage

  if (Object.keys(query).length) {
    skip = 0
  }

  console.log({ itemsPerPage, skip })

  const totalItems = await postgres.quiz.count({ where: query })
  const result = await postgres.quiz.findMany({
    where: query,
    select: {
      _count: true,
      name: true,
      isPublished: true,
      image: true,
      Specialization: {
        select: {
          name: true,
          id: true
        }
      },
      score: true,
      College: {
        select: {
          name: true,
          id: true
        }
      },
      createdAt: true,
      description: true,
      id: true,
      duration: true,
      publishedAt: true,
      User: {
        select: {
          name: true,
          id: true
        }
      }
    },
    skip: skip,
    take: itemsPerPage
  })
  if (!result.length)
    return res.status(200).json({
      result: null,
      msg: 'data not found',
      status: 400
    })

  res.status(200).json({
    result,
    msg: 'successfully retrived projects',
    status: 200,
    totalItems
  })
})

router.get('/filters', async (req, res) => {
  const filters = await postgres.quiz.findMany({
    select: {
      College: {
        select: {
          name: true,
          id: true
        }
      },
      User: {
        select: {
          name: true,
          id: true
        }
      },
      Specialization: {
        select: {
          name: true,
          id: true
        }
      }
    },
    distinct: ['collegeId', 'specializationId', 'createdById']
  })

  res.status(200).json({ result: filters, msg: 'done', status: 200 })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  console.log(id)
  const quiz = await postgres.quiz.findFirst({
    where: {
      id
    },
    include: {
      Questions: {
        include: {
          Choices: true
        }
      },
      User: {
        select: {
          name: true
        }
      },
      College: {
        select: {
          name: true
        }
      },
      Specialization: {
        select: {
          name: true
        }
      }
    }
  })
  res.status(200).json({ result: quiz, msg: 'done', status: 200 })
})

router.post('/api/violations', async (req, res) => {
  try {
    const { type, start, end, duration, quizId } = req.body
    const newViolation = await prisma.createViolation({
      type,
      start,
      end,
      duration
    })
    res.json({ violation: newViolation })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/api/mark-for-review', async (req, res) => {
  const { userId } = req.user
  const { questionId, quizId } = req.body
  try {
    const markedQuestion = await prisma.markedForReview.findFirst({
      where: { questionId, quizId, userId }
    })

    if (markedQuestion) {
      await prisma.question.update({
        where: { id: questionId },
        data: { markedQuestion: false }
      })
    } else {
      await prisma.markedForReview.create({
        data: { questionId, quizId, userId, markedQuestion: true }
      })
    }

    res
      .status(200)
      .send({ message: 'Question marked for review successfully.' })
  } catch (error) {
    res.status(500).send({ message: 'Error marking question for review.' })
  }
})

router.post('/api/selectedOptions', async (req, res) => {
  const { selectedOptions, quizId, userId } = req.body
  try {
    // Iterate over the selected options object
    for (const questionId in selectedOptions) {
      // Check if the question is a single select or MCQ
      if (Array.isArray(selectedOptions[questionId])) {
        // Handle MCQ
        // Deactivate all previously selected options for this question
        await prisma.selected_options.updateMany({
          where: { questionId, quizId, userId },
          data: { isActive: false }
        })
        // Create new options
        selectedOptions[questionId].forEach(async optionId => {
          await prisma.selected_options.create({
            data: {
              optionId,
              questionId,
              quizId,
              userId,
              isActive: true
            }
          })
        })
      } else {
        // Handle single select
        // Deactivate all previously selected options for this question
        await prisma.selected_options.updateMany({
          where: { questionId, quizId, userId },
          data: { isActive: false }
        })
        // Create a new option
        await prisma.selected_options.create({
          data: {
            optionId: selectedOptions[questionId],
            questionId,
            quizId,
            userId,
            isActive: true
          }
        })
      }
    }
    res.status(200).send({ message: 'Selected options stored successfully' })
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Failed to store selected options', error: err })
  }
})

router.post('/save-changes', async (req, res) => {
  try {
    const { questionsData } = req.body
    const existingQuestions = await prisma.question.findMany({
      where: {
        id: {
          $in: questionsData.map(q => q.id)
        }
      }
    })
    const existingOptions = await prisma.option.findMany({
      where: {
        id: {
          $in: questionsData
            .map(q => q.options)
            .flat()
            .map(o => o.id)
        }
      }
    }) // Update existing questions
    const updateQuestionsPromises = existingQuestions.map(existingQuestion => {
      const updatedQuestion = questionsData.find(
        q => q.id === existingQuestion.id
      )
      return prisma.question.update({
        where: { id: existingQuestion.id },
        data: {
          question: updatedQuestion.question,
          type: updatedQuestion.type
        }
      })
    })

    // Update existing options
    const updateOptionsPromises = existingOptions.map(existingOption => {
      const updatedOption = questionsData
        .map(q => q.options)
        .flat()
        .find(o => o.id === existingOption.id)
      return prisma.option.update({
        where: { id: existingOption.id },
        data: {
          option: updatedOption.option,
          isAnswer: updatedOption.isAnswer
        }
      })
    })

    // Create new questions
    const newQuestions = questionsData.filter(
      q => !existingQuestions.find(eq => eq.id === q.id)
    )
    const createQuestionsPromises = newQuestions.map(q => {
      return prisma.question.create({
        data: {
          question: q.question,
          type: q.type
        }
      })
    })

    // Create new options
    const newOptions = questionsData
      .map(q => q.options)
      .flat()
      .filter(o => !existingOptions.find(eo => eo.id === o.id))
    const createOptionsPromises = newOptions.map(o => {
      return prisma.option.create({
        data: {
          option: o.option,
          isAnswer: o.isAnswer
        }
      })
    })

    await Promise.all([
      ...updateQuestionsPromises,
      ...updateOptionsPromises,
      ...createQuestionsPromises,
      ...createOptionsPromises
    ])

    res.status(200).json({ message: 'Changes saved successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error saving changes' })
  }
})

router.get('/hackathons/get', async (req, res) => {
  try {
    const pageN = req.query.page || 1
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto('https://devpost.com/api/hackathons?page=' + pageN)

    await page.waitForSelector('pre')
    let element = await page.$('pre')
    let value = await page.evaluate(el => el.textContent, element)
    await browser.close()
    if (value)
      return res.status(200).json({ result: value, msg: 'done', status: 200 })
  } catch (error) {
    console.log(error)
    res.status(500).json({ result: null, msg: 'error', status: 500 })
  }
})

export default router
