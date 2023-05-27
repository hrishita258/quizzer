import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  Row,
  message
} from 'antd'

import moment from 'moment'
import { Link } from 'react-router-dom'

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getRequest } from '../axios/axiosMethods'
import MessageCard from '../components/MessageCard'
import PageLayout from '../components/PageLayout'

const Quiz = () => {
  const [quizData, setQuizData] = useState(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const [form] = Form.useForm()

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
    { name: quizData ? quizData?.name : params.quizId }
  ]

  useEffect(() => {
    getRequest('quizzes/' + params.quizId)
      .then(response => {
        if (response.status === 200) {
          if (response.data.status) {
            setQuizData(response.data.result)
          }
          setLoading(false)
        } else {
        }
      })
      .catch(err => {
        setLoading(false)
        message.error('internal server error please try agin later')
      })
  }, [params])

  return (
    <PageLayout breadcrumbs={BREADCRUMBS} loading={loading}>
      {quizData ? (
        <div>
          <Descriptions
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Quiz Info</span>
                <Link to={`/quizzes/${params.quizId}/edit`}>
                  <Button type="primary">Edit</Button>
                </Link>
              </div>
            }
            size="small"
            column={24}
            contentStyle={{ textAlign: 'center' }}
          >
            <Descriptions.Item
              span={4}
              label={<span style={{ color: 'gray' }}>Status</span>}
            >
              {quizData?.isPublished ? (
                <>
                  <span
                    style={{
                      height: '9px',
                      width: '20px',
                      background: '#b7eb8f',
                      alignSelf: 'center',
                      marginTop: 4,
                      borderRadius: 20,
                      marginRight: 7
                    }}
                  ></span>
                  <small style={{ alignSelf: 'center', marginTop: 4 }}>
                    Published
                  </small>
                </>
              ) : (
                <>
                  <span
                    style={{
                      height: '9px',
                      width: '20px',
                      background: '#ffa39e',
                      alignSelf: 'center',
                      marginTop: 4,
                      borderRadius: 20,
                      marginRight: 7
                    }}
                  ></span>
                  <small style={{ alignSelf: 'center', marginTop: 4 }}>
                    Pending
                  </small>
                </>
              )}
            </Descriptions.Item>
            <Descriptions.Item
              span={6}
              label={<span style={{ color: 'gray' }}>Created by</span>}
            >
              <small style={{ alignSelf: 'center', marginTop: 4 }}>
                {quizData.User.name}
              </small>
            </Descriptions.Item>

            <Descriptions.Item
              span={6}
              label={<span style={{ color: 'gray' }}>Created at</span>}
            >
              <small style={{ alignSelf: 'center', marginTop: 4 }}>
                {moment(new Date(quizData.createdAt)).format(
                  'MMMM Do YYYY, h:mm:ss a'
                )}
              </small>
            </Descriptions.Item>
            <Descriptions.Item
              span={6}
              label={<span style={{ color: 'gray' }}>Published at</span>}
            >
              <small style={{ alignSelf: 'center', marginTop: 4 }}>
                {quizData.publishedAt
                  ? moment(new Date(quizData.publishedAt)).format(
                      'MMMM Do YYYY, h:mm:ss a'
                    )
                  : '-'}
              </small>
            </Descriptions.Item>
          </Descriptions>
          <Card style={{ padding: '1rem' }}>
            <Form
              layout="vertical"
              form={form}
              initialValues={{
                ...quizData,
                college: quizData.College.name,
                specialization: quizData.Specialization.name
              }}
            >
              <Row gutter={20}>
                <Col span={7}>
                  <Form.Item label="Quiz Name" name="name">
                    <Input placeholder="name" />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item label="Specialization" name="specialization">
                    <Input placeholder="specialization" />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item label="College" name="college">
                    <Input placeholder="college" />
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item label="Duration" name="duration">
                    <Input placeholder="duration" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Description" name="description">
                    <Input.TextArea placeholder="description"></Input.TextArea>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <Divider orientation="left">Questions</Divider>
          <div style={{}}>
            {quizData.Questions?.map((q, i) => (
              <Card
                key={q.id}
                style={{
                  padding: '.5rem 6rem'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <small>Question {i + 1}</small>
                </div>
                <p
                  style={{ fontWeight: 600, fontSize: '1rem' }}
                  dangerouslySetInnerHTML={{ __html: q.question }}
                ></p>
                {q.Choices?.map((choice, j) => (
                  <div
                    key={choice.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20,
                      fontWeight: 500,
                      marginBottom: 15
                    }}
                  >
                    <Avatar
                      shape="square"
                      style={
                        choice.isCorrect
                          ? {
                              background: '#f6ffed',
                              color: '#389e0d',
                              border: '1px solid #b7eb8f'
                            }
                          : ''
                      }
                      size={30}
                    >
                      {String.fromCharCode(65 + j)}
                    </Avatar>
                    <p
                      dangerouslySetInnerHTML={{ __html: choice.text }}
                      style={{
                        color: choice.isCorrect ? '#389e0d' : '',
                        margin: 0
                      }}
                    ></p>
                  </div>
                ))}
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <MessageCard
          status={500}
          title={'500'}
          subTitle={'Sorry, something went wrong.'}
          btnLink={{
            text: 'Back Quizzes',
            link: '/quizzes',
            type: 'primary'
          }}
        />
      )}
    </PageLayout>
  )
}

export default Quiz
