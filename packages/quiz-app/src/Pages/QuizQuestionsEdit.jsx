import {
  BorderInnerOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteTwoTone,
  HighlightOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { Button, Card, FloatButton, Select, Space, Typography } from 'antd'
import { convert } from 'html-to-text'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Link, useParams } from 'react-router-dom'
import { getRequest } from '../axios/axiosMethods'
import PageLayout from '../components/PageLayout'
import QuillEditor from '../components/QuillEditor'

const QuizQuestionsEdit = () => {
  const [questionsData, setQuestionsData] = useState(null)

  const [loading, setLoading] = useState(true)
  const params = useParams()
  const BREADCRUMBS = [
    {
      name: 'Home',
      link: {
        route: '/',
        key: 1
      }
    },
    {
      name: 'Quizzes',
      link: {
        route: '/quizzes',
        key: 2
      }
    },
    { name: questionsData ? questionsData?.name : params.quizId }
  ]

  useEffect(() => {
    getRequest('quizzes/' + params.quizId).then(res => {
      setQuestionsData(res.data.result)
      setLoading(false)
    })
  }, [params])

  const addQuestion = question => {
    const newQuestions = [...questionsData.Questions, question]
    setQuestionsData({ ...questionsData, Questions: newQuestions })
    window.scrollTo(0, document.body.scrollHeight)
  }

  const updateQuestion = (questionId, question) => {
    const newQuestions = [...questionsData.Questions]
    const questionIndex = newQuestions.findIndex(q => q.id === questionId)
    newQuestions[questionIndex] = {
      ...newQuestions[questionIndex],
      ...question
    }
    setQuestionsData({ ...questionsData, Questions: newQuestions })
  }

  const deleteQuestion = questionId => {
    const newQuestions = [...questionsData.Questions].filter(
      question => question.id !== questionId
    )
    setQuestionsData({ ...questionsData, Questions: newQuestions })
  }

  const updateQuestionType = (questionId, newType) => {
    const newQuestions = [...questionsData.Questions]
    const questionIndex = newQuestions.findIndex(
      question => question.id === questionId
    )
    newQuestions[questionIndex] = {
      ...newQuestions[questionIndex],
      type: newType,
      Choices: newQuestions[questionIndex].Choices.map(choice => {
        return { ...choice, isCorrect: false }
      })
    }
    setQuestionsData({ ...questionsData, Questions: newQuestions })
  }

  const updateOption = (questionId, optionId, option) => {
    const newQuestions = [...questionsData.Questions]
    const questionIndex = newQuestions.findIndex(
      question => question.id === questionId
    )
    const questionType = newQuestions[questionIndex].type
    const optionIndex = newQuestions[questionIndex].Choices.findIndex(
      opt => opt.id === optionId
    )

    if (questionType === 'Single') {
      if ('text' in option) {
        newQuestions[questionIndex].Choices[optionIndex] = {
          ...newQuestions[questionIndex].Choices[optionIndex],
          text: option.text
        }
      }

      if ('isCorrect' in option) {
        newQuestions[questionIndex].Choices = newQuestions[
          questionIndex
        ].Choices.map(opt => {
          return { ...opt, isCorrect: opt.id === optionId }
        })
      }
    } else if (questionType === 'MCQ') {
      if ('text' in option) {
        newQuestions[questionIndex].Choices[optionIndex] = {
          ...newQuestions[questionIndex].Choices[optionIndex],
          text: option.text
        }
      } else if ('isCorrect' in option) {
        const currentOption = newQuestions[questionIndex].Choices[optionIndex]
        newQuestions[questionIndex].Choices[optionIndex] = {
          ...currentOption,
          isCorrect: option.isCorrect
        }
      }
    }
    setQuestionsData({ ...questionsData, Questions: newQuestions })
  }

  const addOption = questionIndex => {
    const newQuestions = [...questionsData.Questions]
    const newOption = { id: Date.now(), text: '', isCorrect: false }
    newQuestions[questionIndex].Choices.push(newOption)
    setQuestionsData({ ...questionsData, Questions: newQuestions })
  }

  const deleteOption = (questionId, optionId) => {
    const newQuestions = [...questionsData.Questions]
    const questionIndex = newQuestions.findIndex(
      question => question.id === questionId
    )
    const optionIndex = newQuestions[questionIndex].Choices.findIndex(
      option => option.id === optionId
    )
    newQuestions[questionIndex].Choices.splice(optionIndex, 1)
    setQuestionsData({ ...questionsData, Questions: newQuestions })
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <PageLayout loading={loading} breadcrumbs={BREADCRUMBS}>
      <div
        style={{
          borderBottom: '1px solid lightgray',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <h1 style={{ fontSize: '20px' }}>Questions Builder</h1>
          <p>add new questions to the quiz or update them as per your need</p>
        </div>
        <Link to={`/quizzes/${params.quizId}/quizpanel`}>
          <Button type="primary">Review Quiz</Button>
        </Link>
      </div>
      <div style={{ overflow: 'auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '25px'
          }}
        >
          <Button
            type="text"
            style={{ color: '#1890ff' }}
            onClick={() =>
              addQuestion({
                id: Date.now(),
                text: '',
                type: 'Single',
                Choices: [
                  {
                    id: 1,
                    text: '',
                    isCorrect: false
                  },
                  {
                    id: 2,
                    text: '',
                    isCorrect: false
                  }
                ]
              })
            }
          >
            Add new question
          </Button>
        </div>
        <DragDropContext
          onDragEnd={result => {
            console.log(result)
            // if (!result.destination) {
            //   return
            // }

            // if (result.destination.index === result.source.index) {
            //   return
            // }

            // const newQuestions = [...questionsData.Questions]
            // const [removedQuestion] = newQuestions.splice(
            //   result.source.index,
            //   1
            // )
            // newQuestions.splice(result.destination.index, 0, removedQuestion)
            // setQuestionsData({ ...questionsData, Questions: newQuestions })
          }}
        >
          <Droppable droppableId="question-list" type="question">
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {questionsData?.Questions.map((ques, index) => (
                  <Draggable
                    draggableId={ques.id}
                    index={index}
                    key={ques.id}
                    type="question"
                  >
                    {provided => (
                      <div {...provided.draggableProps} ref={provided.innerRef}>
                        <Card
                          id={ques.id}
                          {...provided.dragHandleProps}
                          style={{
                            padding: '0px 7rem'
                          }}
                        >
                          <div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '.5rem'
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <BorderInnerOutlined
                                  style={{
                                    fontSize: '25px',
                                    color: 'gray',
                                    marginRight: '10px'
                                  }}
                                />
                                <span
                                  style={{ fontSize: '14px', fontWeight: 500 }}
                                >
                                  Question {index + 1}
                                </span>
                              </div>

                              <Space>
                                <Select
                                  defaultValue={ques.type}
                                  style={{ width: 120 }}
                                  onChange={e => updateQuestionType(ques.id, e)}
                                  options={[
                                    { value: 'Single', label: 'Single' },
                                    { value: 'MCQ', label: 'Multiple' }
                                  ]}
                                ></Select>
                              </Space>
                              <Button
                                danger
                                type="primary"
                                shape="circle"
                                onClick={() => deleteQuestion(ques.id)}
                              >
                                <DeleteTwoTone
                                  twoToneColor="white"
                                  style={{
                                    fontSize: '16px',
                                    cursor: 'pointer'
                                  }}
                                />
                              </Button>
                            </div>
                            <QuillEditor question={ques.question} />
                            <div style={{ marginTop: '25px' }}>
                              {ques.Choices?.map((choice, j) => (
                                <Card
                                  key={choice.id}
                                  style={{
                                    marginBottom: 15,
                                    boxShadow: 'none'
                                  }}
                                  bodyStyle={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 20,
                                    fontWeight: 500,
                                    padding: 7
                                  }}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}
                                  >
                                    <BorderInnerOutlined
                                      style={{
                                        fontSize: '23px',
                                        color: 'gray',
                                        marginRight: 10
                                      }}
                                    />
                                    <span
                                      style={{
                                        fontSize: '14px',
                                        color: 'gray'
                                      }}
                                    >
                                      {String.fromCharCode(65 + j)}{' '}
                                    </span>
                                  </div>
                                  <Typography.Paragraph
                                    style={{
                                      fontSize: '14px',
                                      width: '80%',
                                      margin: 0
                                    }}
                                    editable={{
                                      icon: <HighlightOutlined />,
                                      tooltip: 'click to edit text',
                                      onChange: text => {
                                        updateOption(ques.id, choice.id, {
                                          text
                                        })
                                      }
                                    }}
                                  >
                                    {convert(choice.text)}
                                  </Typography.Paragraph>
                                  <div style={{ display: 'flex', gap: 10 }}>
                                    <Button
                                      style={{
                                        backgroundColor: choice.isCorrect
                                          ? '#50cd89'
                                          : '#e8fff3',
                                        color: choice.isCorrect
                                          ? '#FFF'
                                          : '#50cd89',
                                        borderColor: '#b7eb8f',
                                        height: 30,
                                        width: 30,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '20px'
                                      }}
                                      onClick={() =>
                                        updateOption(ques.id, choice.id, {
                                          isCorrect: true
                                        })
                                      }
                                    >
                                      <CheckOutlined />
                                    </Button>
                                    <Button
                                      type="text"
                                      onClick={() => {
                                        deleteOption(ques.id, choice.id)
                                      }}
                                    >
                                      <CloseOutlined />
                                    </Button>
                                  </div>
                                </Card>
                              ))}
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  marginTop: '20px'
                                }}
                              >
                                <Button
                                  type="text"
                                  style={{ color: '#1890ff' }}
                                  onClick={() => addOption(index)}
                                >
                                  <PlusOutlined /> Add Option
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '15px'
          }}
        >
          <Button
            key="bottomQaddBtn"
            onClick={() =>
              addQuestion({
                id: Date.now(),
                text: '',
                type: 'Single',
                Choices: [
                  {
                    id: 1,
                    text: '',
                    isCorrect: false
                  },
                  {
                    id: 2,
                    text: '',
                    isCorrect: false
                  }
                ]
              })
            }
          >
            Add new question
          </Button>
        </div>
        <FloatButton.BackTop />
      </div>
    </PageLayout>
  )
}

export default QuizQuestionsEdit
