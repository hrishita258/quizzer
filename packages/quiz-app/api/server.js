import { PrismaClient } from '@prisma/client'
import async from 'async'
import bcrypt from 'bcryptjs'
import cheerio from 'cheerio'
import cors from 'cors'
import { randomBytes } from 'crypto'
import express from 'express'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import { MeiliSearch } from 'meilisearch'
import puppeteer from 'puppeteer'
import APIRoutes from './Routes/index.js'
import QuizLinks from './allQuizzes.js'
import initScheduledJobs from './cronjobs/OpportunityCrons.js'
import postgres from './db/Prisma.js'

const client = new MeiliSearch({
  host: 'https://ms-10cf7dd0c824-1050.sgp.meilisearch.io',
  apiKey: '78dc5f0674d379eba942767e92eca10803d86078'
})

const app = express()

const prisma = new PrismaClient()
const PORT = 4000

const ACCESS_TOKEN_EXPIRE_TIME = 3600
const JWT_ACCESS_SECRET = 'access_secret_HH'

const authTokenMiddleware = secret => {
  return (req, res, next) => {
    const token = req.headers['authorization']
    if (token) {
      try {
        const user = jwt.verify(token, secret)
        req.user = user
      } catch (err) {
        console.log(err)
      }
    }
    next()
  }
}

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(authTokenMiddleware(JWT_ACCESS_SECRET))

app.disable('x-powered-by')

app.use('/api', APIRoutes)

app.get('/mlh', async (req, res) => {
  const response = await client.index('mlh').getDocuments({ limit: 1000 })
  res.json({ response })
})

app.get('/', (req, res) => {
  res.json({ user: req.user })
})

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body
  const userAgent = req.headers['user-agent']
  console.log({ userAgent })
  if (!userAgent)
    return res.send({ status: 401, msg: 'user-agent not found......' })
  const user = await prisma.user.findFirst({
    where: { email }
  })
  if (!user || !user.isActive)
    return res.send({
      status: 401,
      msg: 'user not found or user is inactive...!'
    })
  if (!(await bcrypt.compare(password, user.password)))
    return res.send({
      status: 401,
      msg: 'user credentials not found'
    })
  const { accessToken, refreshToken, issuedAt, expiresAt } =
    generateTokens(user)
  try {
    await prisma.refreshTokens.create({
      data: {
        userAgent,
        token: refreshToken,
        userId: user.id
      }
    })
  } catch (err) {
    console.log(err)
  }
  res.status(200).json({
    result: {
      userId: user.id,
      role: user.role,
      email: user.email,
      fullname: user.name,
      profileImage: user.profileImage,
      accessToken,
      refreshToken,
      issuedAt,
      expiresAt
    },
    status: 200
  })
})

app.post('/refresh', async (req, res) => {
  console.log('called', req.body)
  const { token } = req.body
  if (!token) return res.status(400).json({ msg: 'token not provided' })
  const userAgent = req.headers['user-agent']
  if (!userAgent) res.status(400).json({ msg: 'user-agent not provided' })
  try {
    const foundRefreshToken = await prisma.refreshTokens.findFirst({
      where: {
        token
      }
    })
    console.log({ foundRefreshToken })
    if (!foundRefreshToken || !foundRefreshToken.isActive)
      return res.status(403).json({
        msg: 'no refresh token is found'
      })

    const user = await prisma.user.findFirst({
      where: {
        id: foundRefreshToken.userId
      }
    })
    if (!user)
      return res.status(401).json({ msg: 'no user found with that token' })
    if (!user.isActive)
      return res.status(403).json({ msg: 'user is not active' })
    const { accessToken, refreshToken, issuedAt, expiresAt } =
      generateTokens(user)
    await prisma.refreshTokens.update({
      where: {
        id: foundRefreshToken.id
      },
      data: {
        token: refreshToken,
        userAgent
      }
    })

    return res.status(200).json({
      userId: user.id,
      role: user.role,
      email: user.email,
      fullname: user.name,
      profileImage: user.profileImage,
      accessToken,
      refreshToken,
      issuedAt,
      expiresAt
    })
  } catch (error) {
    console.log(error)
  }
})

app.post('/api/admin/activeSessions', async (req, res) => {
  try {
    const { token } = req.body
    if (!token)
      return res.status(400).json({ status: 403, msg: 'token not provided' })
    const refreshToken = await prisma.refreshTokens.findMany({
      where: {
        userId: req.user.id,
        isActive: true
      }
    })

    refreshToken.forEach(rf => {
      if (rf.token !== token) {
        rf.token = ''
      }
    })

    res.json({ status: 200, result: refreshToken })
  } catch (error) {
    console.log(error)
  }
})

app.get('/quiz/add', async (req, res) => {
  const scrappedData = []

  try {
    const newD = scrappedData?.map(
      ({ result: [{ title, quizImage, description }, ...questions] }) => {
        return {
          title,
          quizImage,
          description,
          questions: questions.map(({ ques, options, correctOption }) => ({
            question: ques,
            options: options.map(option => ({
              option,
              isCorrect: option === correctOption
            }))
          }))
        }
      }
    )

    const faculties = await postgres.user.findMany({
      where: {
        role: 'faculty'
      }
    })
    const specializations = await postgres.specialization.findMany()

    const newQuiz = await Promise.all(
      newD.map(async ({ title, quizImage, description, questions }) => {
        const newQuiz = await postgres.quiz.create({
          data: {
            name: title,
            description,
            createdById: faculties[Math.floor(Math.random() * 13) + 1].id,
            collegeId: '91d4727d-37c1-4e29-9e33-03b3f288fd55',
            isPublished: false,
            specializationId:
              specializations[Math.floor(Math.random() * 3) + 1],
            Questions: {
              createMany: {
                data: questions.map(({ question, options }) => ({
                  question,
                  type: 'MCQ',
                  Choices: {
                    createMany: {
                      data: options.map(({ option, isCorrect }) => ({
                        text: option,
                        isCorrect
                      }))
                    }
                  }
                }))
              }
            }
          }
        })
        return newQuiz
      })
    )

    res.send(newQuiz)
  } catch (err) {
    console.log(err)
  }
})

app.get('/transformData', (req, res) => {
  // Read the JSON file
  fs.readFile('allQuizzesWithTopics.json', 'utf8', (err, data) => {
    if (err) throw err

    // Parse the JSON data
    let jsonData = JSON.parse(data)
    // Iterating over all the quizzes
    jsonData.allQuizzes.forEach(quiz => {
      // Convert the quizzez array to set and again convert to array
      quiz.quizzes = [...new Set(quiz.quizzes)]
    })

    // Write the updated JSON data to a new file
    fs.writeFile(
      'data-no-duplicates.json',
      JSON.stringify(jsonData),
      'utf8',
      err => {
        if (err) throw err
        console.log('Duplicates removed!')
      }
    )
  })
})

app.get('/build', async (req, res) => {
  console.log('called')
  const urls = []

  const browser = await puppeteer.launch({ headless: true })
  const data = []
  const errors = []
  const limit = 5

  async.eachLimit(
    urls,
    limit,
    async url => {
      try {
        console.log(`Processing ${url}`)
        const page = await browser.newPage()
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 })

        // Extract data from the page
        const result = await page.evaluate(() => {
          let s = []
          Array.from(
            document.getElementsByClassName('questions-list')[0]?.children || []
          )?.map(question => {
            let ques =
              question.getElementsByClassName('question-text')[0]?.innerText
            let options = Array.from(
              question.getElementsByClassName('answers-list')[0]?.children || []
            )?.map(op => op.getElementsByClassName('opt_text')[0]?.innerText)
            s.push({
              ques,
              options,
              title: document.title,
              quizImage: document.getElementsByClassName('image_class')[0]?.src,
              questionImage: question.getElementsByTagName('img')[0]?.src,
              description:
                document.getElementsByClassName('question_text')[0].innerText
            })
          })
          return s
        })
        await page.click('button[name="mySubmit"]')
        await page.waitForSelector('#progressBar', { timeout: 90000 })
        // Extract correct answers
        const correct = await page.evaluate(
          async (url, result) => {
            let queryParams = url.split('?')[1]

            if (!queryParams) {
              console.error('URL does not contain any query parameters')
              return
            }

            let title = queryParams.split('&').find(p => p.startsWith('title='))

            if (!title) {
              console.error('URL does not contain a title parameter')
              return
            }

            title = title.split('=')[1]

            let requests = result.map(async (question, index) => {
              try {
                const response = await fetch(
                  `https://www.proprofs.com/quiz-school/_ajax_quizshow_free.php?title=${title}&q=${
                    index + 1
                  }`
                )
                const res = await response.text()
                let parser = new DOMParser()
                let doc = parser.parseFromString(res, 'text/html')
                return doc.getElementsByClassName('correctTxt')[0].innerText
              } catch (err) {
                console.log(err, 'ye correct option')
              }
            })
            return await Promise.all(requests)
          },
          url,
          result
        )
        data.push({ result, correct })
        await page.close()
      } catch (error) {
        console.log(error, 'thhoda uppar')
        errors.push({ url, error: error.toString() })
      }
    },
    async err => {
      if (err) {
        console.log(err, 'niche')
      } else {
        console.log('All URLs have been processed.')
        await browser.close()
        // Send the final data and errors
        let finalData = data.map((d, i) => {
          let result = d.result?.map((r, j) => {
            return {
              ...r,
              correctOption: d?.correct[j]
            }
          })
          return {
            index: i,
            result
          }
        })
        res.send({ finalData, errors })
      }
    }
  )
})

app.get('/final', async (req, res) => {
  const data = []
  const errors = []

  fs.readFile('data-no-duplicates.json', 'utf8', async (err, json) => {
    if (err) throw err

    const keywords = [
      'C Programming',
      'Web',
      'javascript',
      'Programming',
      'computer',
      'C++',
      'C#',
      'Java',
      'SQL',
      'Ruby',
      'Perl',
      'Swift',
      'Objective-C',
      'Scala',
      'Haskell',
      'MATLAB',
      'Lisp',
      'Clojure',
      'Dart',
      'Rust',
      'Elixir',
      'Erlang',
      'Prolog',
      'F#',
      'TypeScript',
      'Kotlin',
      'Groovy',
      'xml',
      'network',
      'html',
      'css',
      'jquery',
      'bootstrap',
      'angular',
      'react',
      'vue',
      'node',
      'express',
      'mongodb',
      'mysql',
      'sql',
      'php',
      'python',
      'website',
      'excel',
      'networking',
      'apptitude',
      'CCNA',
      'cisco',
      'Cloud',
      'Cyber',
      'data',
      'database',
      'design',
      'desktop',
      'Engineer',
      'Engineering',
      'Fundamental',
      'Fundamentals',
      'google',
      'Graphic',
      'Information',
      'Innovation',
      'Integrated',
      'Intelligence',
      'Internet',
      'security',
      'Microsoft',
      'Certification',
      'Linux',
      'Machine',
      'Object',
      'Office',
      'Placement',
      'Powerpoint',
      'production',
      'Programmer',
      'product',
      'project',
      'professional',
      'protocol',
      'server',
      'admin',
      'software'
    ]
    const allQuizzes = JSON.parse(json).allQuizzes
    const quizzes = allQuizzes.filter(quiz => {
      return keywords.some(keyword =>
        quiz.topic.toLowerCase().includes(keyword.toLowerCase())
      )
    })

    const browser = await puppeteer.launch({ headless: false })

    await async.eachLimit(
      quizzes.slice(120, 180),
      1,
      async quiz => {
        const uniqueUrls = [...new Set(quiz.quizzes)]
        const limit = 2
        console.log('Processing topic', quiz.topic)
        for (let i = 0; i < uniqueUrls.length; i += limit) {
          const pagePromises = uniqueUrls
            .slice(i, i + limit)
            .map(async (url, i) => {
              const page = await browser.newPage()
              try {
                console.log(`${i + 1} of ${uniqueUrls.length}`)
                await page.goto(url, {
                  waitUntil: 'networkidle2',
                  timeout: 60000
                })

                if ((await page.title()).includes('404')) throw '404'

                const pageHtml = await page.content()
                const $ = cheerio.load(pageHtml)

                const result = $('.questions-list')
                  .children()
                  .map((i, question) => {
                    const ques = $(question).find('.question-text').text()
                    const options = $(question)
                      .find('.answers-list')
                      .children()
                      .map((i, option) => {
                        return $(option).find('.opt_text').text()
                      })
                      .get()
                    return {
                      ques,
                      options,
                      title: $('title').text(),
                      quizImage: $('.image_class').attr('src'),
                      questionImage: $(question).find('img').attr('src'),
                      description: $('.question_text').text()
                    }
                  })
                  .get()

                await page.waitForSelector('button[name="mySubmit"]', {
                  timeout: 60000
                })

                await page.click('button[name="mySubmit"]')

                await page.waitForRequest(request =>
                  request.url().includes('quiz-school/quizstart.php')
                )

                await page.waitForSelector('.qs_show_wrap')

                const correct = await page.evaluate(
                  async (url, result) => {
                    let queryParams = url.split('?')[1]

                    if (!queryParams) {
                      console.error('URL does not contain any query parameters')
                      return
                    }

                    let title = queryParams
                      .split('&')
                      .find(p => p.startsWith('title='))

                    if (!title) {
                      console.error('URL does not contain a title parameter')
                      return
                    }

                    title = title.split('=')[1]

                    let requests = result.map(async (question, index) => {
                      try {
                        const response = await fetch(
                          `https://www.proprofs.com/quiz-school/_ajax_quizshow_free.php?title=${title}&q=${
                            index + 1
                          }`
                        )
                        const res = await response.text()

                        return res
                      } catch (err) {
                        console.log(err, 'ye correct option')
                      }
                    })
                    return await Promise.all(requests)
                  },
                  url,
                  result
                )
                await page.close()

                let correctAnswers = correct?.map((c, i) => {
                  let $ = cheerio.load(c)

                  let correct = Array.from($('.correctTxt')).map(s =>
                    s?.children[0]?.data?.replace('(Correct Answer)', '')
                  )

                  return {
                    correct,
                    question:
                      $('.after_question').text() ||
                      Array.from($('.question_text_area'))[0]?.children[0]?.data
                  }
                })

                data.push({
                  result,
                  correctAnswers,
                  topic: quiz.topic
                })
              } catch (error) {
                console.error(error.toString())
                await page.close()
                errors.push({ url, error: error.toString() })
              }
            })
          await Promise.all(pagePromises)
        }
      },
      async err => {
        if (err) {
          console.log(err)
        }
        await browser.close()
        console.log(data.length, errors.length)

        fs.writeFile(
          'quizDataAll7.json',
          JSON.stringify({
            data,
            errors
          }),
          'utf8',
          err => {
            if (err) throw err
            console.log('done dona done done')
          }
        )
      }
    )
  })
})

app.get('/api/v1/quiz', async (req, res) => {
  console.log('processing')
  const urls = []

  const browser = await puppeteer.launch()
  const allQuizzes = []
  const concurrency = 5
  let currentPage = 0
  const errors = []

  const pages = await browser.pages()
  async.eachLimit(
    urls.slice(0, 30),
    concurrency,
    async url => {
      let paginatedPage = null
      console.log(currentPage)
      const page = pages[currentPage++] || (await browser.newPage())
      try {
        await page.goto(url, { timeout: 60000 })
        let obj = {
          topic: '',
          quizzes: []
        }
        console.log(await page.$eval('.classh1', el => el.innerText))
        obj.topic = await page.$eval('.classh1', el => el.innerText)
        if ((await page.$('.pages')) !== null) {
          let pages = await page.$$eval('.pages p', el => {
            return parseInt(el[0].children[el[0].children.length - 2].innerText)
          })

          for (let i = 1; i <= pages; i++) {
            await page.goto(`${url}/${i}`, { timeout: 60000 })
            paginatedPage = i
            console.log('page child', i)
            await page.waitForSelector('.pop_main_updated a')
            let paginatedUrls = await page.$$eval('.pop_main_updated a', el => {
              return el.map(elem => elem.href)
            })
            obj.quizzes.push(...paginatedUrls)
          }
          allQuizzes.push(obj)
        } else {
          let singleUrls = await page.$$eval('.pop_main_updated a', el => {
            return el.map(elem => elem.href)
          })
          obj.quizzes.push(...singleUrls)
          allQuizzes.push(obj)
        }
      } catch (error) {
        console.log(url, error.toString(), paginatedPage)
        errors.push({ error: error.toString(), url, paginatedPage })
      } finally {
        await page.close()
      }
    },
    err => {
      if (err) throw err
      if (allQuizzes.length > 0)
        fs.writeFile(
          'allQuizzesWithTopics.json',
          JSON.stringify({ allQuizzes, errors }),
          err => {
            if (err) throw err
            console.log('Data written to file')
          }
        )
      browser.close()
    }
  )
})

app.get('/api/quizzes', async (req, res) => {
  const browser = await puppeteer.launch({ headless: false })
  const data = []
  const errors = []
  for (let i = 0; i < 5; i++) {
    console.log('processing' + ' ' + i, QuizLinks[i])
    try {
      let page = await browser.newPage()
      await page.goto(QuizLinks[i])
      const result = await page.evaluate(i => {
        let s = []
        Array.from(
          document.getElementsByClassName('questions-list')[0].children
        ).map(question => {
          let ques =
            question.getElementsByClassName('question-text')[0].innerText
          let options = Array.from(
            question.getElementsByClassName('answers-list')[0].children
          ).map(op => op.getElementsByClassName('opt_text')[0].innerText)
          s.push({
            ques,
            options,
            title: document.title,
            quizImage: document.getElementsByClassName('image_class')[0].src,
            description:
              document.getElementsByClassName('question_text')[0].innerText
          })
        })
        return s
      }, i)
      await page.click('button[name="mySubmit"]')
      data.push({ index: i, result })
    } catch (error) {
      console.log(error)
      errors.push({ index: i, error, url: QuizLinks[i] })
    }
  }
  // console.log(JSON.stringify(data))
  // console.log(JSON.stringify(errors))
})

app.get('/trans', (req, res) => {
  fs.readFile('quizDataAll5.json', 'utf8', async (err, json) => {
    if (err) throw err
    const { quizzes } = JSON.parse(json)
    console.log(quizzes.length)

    const specializationsData = (
      await prisma.user.findMany({
        where: {
          role: 'faculty'
        },
        select: {
          id: true,
          specialization: true
        }
      })
    )?.map(user => ({
      id: user.id,
      specializationId: user.specialization.id,
      specialization: user.specialization.name
    }))
    console.log(specializationsData)
    // try {
    //   Quizzez.forEach(data => {
    //     let quiz = {
    //       name: data.result[0]?.title
    //         ? data.result[0]?.title
    //         : data.result[1]?.title,
    //       topic: data?.topic,
    //       questions: [],
    //       description: data.result[0]?.description,
    //       quizImage: data.result[0]?.quizImage
    //     }
    //     data.result.forEach(question => {
    //       if (question.ques?.trim().length === 0) return // Skip the question if it's empty
    //       let cleanQuestion = question.ques?.trim().replace(/\s+/g, ' ')

    //       let correctAnswers = data.correctAnswers?.find(answers => {
    //         return (
    //           answers.question?.trim().replace(/\s+/g, ' ') === cleanQuestion
    //         )
    //       })
    //       if (correctAnswers) {
    //         question.options = question.options.map(option => {
    //           return {
    //             text: option?.trim().replace(/\s+/g, ' '),
    //             isCorrect: correctAnswers.correct.some(
    //               answer =>
    //                 answer?.trim().replace(/\s+/g, ' ') ===
    //                 option?.trim().replace(/\s+/g, ' ')
    //             )
    //           }
    //         })
    //         let correctCount = question.options.filter(
    //           option => option.isCorrect === true
    //         ).length
    //         question.type = correctCount > 1 ? 'multiple' : 'single'
    //       }

    //       if (
    //         question.options.findIndex(option => option.isCorrect === true) !==
    //         -1
    //       ) {
    //         quiz.questions.push({
    //           question: question.ques,
    //           type: question.type,
    //           options: question.options
    //         })
    //       }
    //     })
    //     newData.quizzes.push(quiz)
    //   })
    // } catch (error) {
    //   console.log(error)
    // }
    const specializations = [
      'Computer Virus Quizzes & Trivia',
      'Computer Technology Quizzes & Trivia',
      'Computer Science Quizzes & Trivia',
      'Computer Terminology Quizzes & Trivia',
      'Computer Vocabulary Quizzes & Trivia',
      'Core Java Quizzes & Trivia',
      'CSS Quizzes & Trivia',
      'Ctt Plus Certification Quizzes & Trivia',
      'Cyber Safety Quizzes & Trivia',
      'Cyber Quizzes & Trivia',
      'Cyber Citizenship Quizzes & Trivia',
      'Cyber Security Quizzes & Trivia',
      'Computer Quizzes & Trivia',
      'Data Analysis Quizzes & Trivia',
      'Data Collection Quizzes & Trivia',
      'Data Communication Quizzes & Trivia',
      'Data Entry Quizzes & Trivia',
      'Data Mining Quizzes & Trivia',
      'Data Handling Quizzes & Trivia',
      'Data Management Quizzes & Trivia',
      'Data Science Quizzes & Trivia',
      'Data Representation Quizzes & Trivia',
      'Data Protection Quizzes & Trivia',
      'Data Security Quizzes & Trivia',
      'Data Type Quizzes & Trivia',
      'Data Warehousing Quizzes & Trivia',
      'Database Concept Quizzes & Trivia',
      'Data Structure Quizzes & Trivia',
      'Database Management System Quizzes & Trivia',
      'Database Quizzes & Trivia',
      'Data Quizzes & Trivia',
      'Desktop Quizzes & Trivia',
      'Design Technique Quizzes & Trivia',
      'Desktop Support Quizzes & Trivia',
      'Design Quizzes & Trivia',
      'Desktop Publishing Quizzes & Trivia',
      'Digidesign Quizzes & Trivia',
      'Electrical Engineering Quizzes & Trivia',
      'Electronics Engineering Quizzes & Trivia',
      'Engineer Quizzes & Trivia',
      'Engineering Exam Quizzes & Trivia',
      'Engineering Quizzes & Trivia',
      'Excel 2010 Quizzes & Trivia',
      'Excel Quizzes & Trivia',
      'Expression Quizzes & Trivia',
      'Facial Expression Quizzes & Trivia',
      'Factors Of Production Quizzes & Trivia',
      'Female Reproductive System Quizzes & Trivia',
      'Front Office Quizzes & Trivia',
      'Fundamental Of Software Testing Quizzes & Trivia',
      'Fundamentals Quizzes & Trivia',
      'Fundamentals Of Nursing Quizzes & Trivia',
      'Fundamentals Of Nursing NCLEX Quizzes & Trivia',
      'Genetic Engineering Quizzes & Trivia',
      'Geographic Quizzes & Trivia',
      'Google Docs Quizzes & Trivia',
      'Google Sketchup Quizzes & Trivia',
      'Google Quizzes & Trivia',
      'Graphic Design Quizzes & Trivia'
    ]

    try {
      for (const quiz of quizzes.filter(s => s.questions.length > 0)) {
        if (specializations.includes(quiz.topic)) {
          console.log(quiz.name)

          const existingQuiz = await prisma.quiz.findFirst({
            where: { name: quiz.name.replace('- ProProfs Quiz', '') }
          })
          if (existingQuiz) {
            console.log(`Quiz ${quiz.name} already exists, skipping...`)
            continue
          }
          console.log({ hh: quiz.topic })
          let sd = specializationsData.find(
            s => s.specialization.trim() === quiz.topic
          )
          console.log({ sd })
          if (sd) {
            console.log(`Specialization ${sd.specialization} found`)
            const createdQuiz = await prisma.quiz.create({
              data: {
                name: quiz.name.replace('- ProProfs Quiz', ''),
                description: quiz.description,
                image: quiz.quizImage,
                collegeId: '74202609-1638-42ef-8a50-4b79da0d4f13',
                specializationId: sd.specializationId,
                isPublished: true,
                createdById: sd.id,
                duration: quiz.questions.length * 2
              }
            })

            for (const question of quiz.questions) {
              const createdQuestion = await prisma.quizQuestions.create({
                data: {
                  question: question.question,
                  type: question.type === 'multiple' ? 'MCQ' : 'Single',
                  quizId: createdQuiz.id,
                  Choices: {
                    createMany: {
                      data: question.options.map(option => {
                        return {
                          text: option.text,
                          isCorrect: option.isCorrect
                        }
                      })
                    }
                  }
                }
              })
            }
          }
        } else {
          console.log('not working')
        }
      }
      console.log('Quiz created successfully')
    } catch (error) {
      console.log(error)
    }
  })
})

app.get('/trans2', (req, res) => {
  fs.readFile('quizlib.json', 'utf8', async (err, json) => {
    const outerArray = JSON.parse(json)
    const filteredQuestions = []
    try {
      const questions = outerArray.map(x => x.results)
      let allQuestions = []
      questions.forEach(question => {
        allQuestions = [...allQuestions, ...question]
      })
      for (let i = 0; i < allQuestions.length; i++) {
        const question = allQuestions[i]
        const category = question.category
        let categoryExists = false

        for (let j = 0; j < filteredQuestions.length; j++) {
          if (filteredQuestions[j].name === category) {
            let options = [{ text: question.correct_answer, isCorrect: true }]
            if (question.incorrect_answers) {
              options = [
                ...options,
                ...question.incorrect_answers.map(x => ({
                  text: x,
                  isCorrect: false
                }))
              ]
            }
            filteredQuestions[j].questions.push({
              question: question.question,
              type: question.type,
              options: options
            })
            categoryExists = true
            break
          }
        }

        if (!categoryExists) {
          let options = [{ text: question.correct_answer, isCorrect: true }]
          if (question.incorrect_answers) {
            options = [
              ...options,
              ...question.incorrect_answers.map(x => ({
                text: x,
                isCorrect: false
              }))
            ]
          }
          filteredQuestions.push({
            name: category,
            questions: [
              {
                question: question.question,
                type: question.type,
                options: options
              }
            ]
          })
        }
      }
    } catch (error) {
      console.log(error)
    }
    for (let i = 0; i < filteredQuestions.length; i++) {
      const quiz = filteredQuestions[i]
      if (quiz.questions.length > 30) {
        const parts = []
        let currentPart = { name: '', questions: [] }
        for (let j = 0; j < quiz.questions.length; j++) {
          const question = quiz.questions[j]
          if (currentPart.questions.length === 0) {
            currentPart.name = `${quiz.name} - Part 1`
          } else if (currentPart.questions.length === 30) {
            parts.push(currentPart)
            currentPart = {
              name: `${quiz.name} - Part ${parts.length + 1}`,
              questions: []
            }
          }
          currentPart.questions.push(question)
        }
        parts.push(currentPart)
        filteredQuestions.splice(i, 1, ...parts)
      }
    }

    res.send(filteredQuestions)
  })
})

app.get('/setup', async (req, res) => {})

const generateTokens = user => {
  const iat = Math.floor(Date.now() / 1000)
  const expire = Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRE_TIME
  const accessToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
      iat,
      expire
    },
    JWT_ACCESS_SECRET
  )
  const refreshToken = generateRandomString()
  return {
    accessToken,
    refreshToken,
    issuedAt: iat,
    expiresAt: expire
  }
}
const generateRandomString = () => randomBytes(128).toString('hex')
initScheduledJobs()

app.listen(PORT, console.log('server started on port' + ' ' + PORT))
