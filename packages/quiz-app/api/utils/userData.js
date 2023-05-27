const { postgres } = require('../db')

let count = 0
// const quezez = await postgres.quiz.createMany({
//   data: await Promise.all(
//     quizData.map(async s => {
//       if (count > faculty.length - 2) count = 0
//       count++
//       console.log(faculty[count].id)
//       return {
//         name: s.specialization,
//         duration: s.questions.length * 2,
//         isPublished: false,
//         specializationId: (
//           await postgres.specialization.findFirst({
//             where: {
//               name: s.specialization
//             },
//             select: {
//               id: true
//             }
//           })
//         ).id,
//         createdById: faculty[Math.floor(Math.random() * 13) + 1].id,
//         collegeId: '91d4727d-37c1-4e29-9e33-03b3f288fd55',
//         isPublished: false
//       }
//     })
//   )
// })
// console.log(JSON.stringify(faculty))
// const allQuiz = await postgres.quiz.findMany({
//   select: {
//     id: true,
//     name: true
//   }
// })
// for (let i = 0; i < allQuiz.length; i++) {
//   const quiz = quizData.find(s => s.specialization === allQuiz[i].name)
//   if (quiz) {
//     await postgres.quizQuestions.createMany({
//       data: quiz.questions.map(s => {
//         return {
//           question: s.question,
//           type: s.type,
//           quizId: allQuiz[i].id
//         }
//       })
//     })
//   }
//   console.log(quiz.specialization)
// }
//  const allQuiz = await postgres.quiz.findMany({
//    select: {
//      id: true,
//      name: true
//    }
//  })
//  for (let i = 0; i < allQuiz.length; i++) {
//    const quiz = quizData.find(s => s.specialization === allQuiz[i].name)
//    if (quiz) {
//      quiz.questions.forEach(async s => {
//        await postgres.quizQuestions.create({
//          data: {
//            question: s.question,
//            type: s.type,
//            quizId: allQuiz[i].id,
//            Choices: {
//              createMany: {
//                data: s.options.map((ch, i) => {
//                  return {
//                    text: ch,
//                    isCorrect: i === s.correct ? true : false
//                  }
//                })
//              }
//            }
//          }
//        })
//      })
//    }
//    console.log(quiz.specialization)
//  }
const main = async () => {
  const faculty = await postgres.user.findMany({
    where: {
      role: 'faculty'
    }
  })
  // const quezez = await postgres.quiz.createMany({
  //   data: await Promise.all(
  //     quizData2.map(async s => {
  //       if (count > faculty.length - 2) count = 0
  //       count++
  //       console.log(faculty[count].id)
  //       return {
  //         name: s.specialization + ' Quiz',
  //         duration: s.questions.length * 2,
  //         isPublished: false,
  //         specializationId: (
  //           await postgres.specialization.findFirst({
  //             where: {
  //               name: s.specialization
  //             },
  //             select: {
  //               id: true
  //             }
  //           })
  //         ).id,
  //         createdById: faculty[Math.floor(Math.random() * 13) + 1].id,
  //         collegeId: '91d4727d-37c1-4e29-9e33-03b3f288fd55',
  //         isPublished: false
  //       }
  //     })
  //   )
  // })
  // const quiz = await postgres.quiz.findMany({
  //   include: {
  //     Specialization: {
  //       select: {
  //         name: true
  //       }
  //     },
  //     Questions: {
  //       select: {
  //         Choices: {
  //           select: {
  //             id: true,
  //             isCorrect: true,
  //             text: true
  //           }
  //         },
  //         question: true,
  //         id: true,
  //         type: true
  //       }
  //     }
  //   }
  // })
  // console.log(JSON.stringify(quiz))
  // const allQuiz = await postgres.quiz.findMany({
  //   select: {
  //     id: true,
  //     name: true
  //   }
  // })
  // for (let i = 0; i < allQuiz.length; i++) {
  //   const quiz = quizData2.find(
  //     s => s.specialization + ' Quiz' === allQuiz[i].name
  //   )
  //   if (quiz) {
  //     quiz.questions.forEach(async s => {
  //       await postgres.quizQuestions.create({
  //         data: {
  //           question: s.question,
  //           type: s.type,
  //           quizId: allQuiz[i].id,
  //           Choices: {
  //             createMany: {
  //               data: s.options.map((ch, i) => {
  //                 return {
  //                   text: ch,
  //                   isCorrect: i === s.correct ? true : false
  //                 }
  //               })
  //             }
  //           }
  //         }
  //       })
  //     })
  //     console.log(quiz.specialization)
  //   }
  // }
}

main().then(() => console.log('done'))
