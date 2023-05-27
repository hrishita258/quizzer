import {
  Avatar,
  Card,
  Col,
  Divider,
  Form,
  message,
  Pagination,
  Row,
  Select,
  Spin,
  Tag
} from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRequest } from '../axios/axiosMethods'
import MessageCard from '../components/MessageCard'
import PageLayout from '../components/PageLayout'
import QuizCardStat from '../components/QuizCardStat'

const BREADCRUMBS = [
  {
    name: 'Home',
    link: {
      route: '/',
      key: 1
    }
  },
  {
    name: 'Quizzes'
  }
]

const images = [
  'https://media-fastly.hackerearth.com/media/hackathon/buidl-the-future/images/700c45c24e-image_1_1.png',
  'https://media-fastly.hackerearth.com/media/hackathon/ibm-z-student-contest-2022/images/99ca390a0e-Listing2x.png',
  'https://media-fastly.hackerearth.com/media/hackathon/november-easy-22/images/2d43595259-Listing.png',
  'https://media-fastly.hackerearth.com/media/hackathon/wsis-dga-hack/images/befdd33c53-Cover__1_1.png',
  'https://media-fastly.hackerearth.com/media/hackathon/build-a-climate-fintech-app/images/d861775a2e-Listing.png',
  'https://media-fastly.hackerearth.com/media/hackathon/SORDI-ai-hackathon-2022/images/ba2e5d564f-Thumbnail1.png',
  'https://media-fastly.hackerearth.com/media/hackathon/chhalaang-hack/images/b9b09ab650-Listing.png',
  'https://media-fastly.hackerearth.com/media/hackathon/ust-d3code-campus-hackathon22/images/d2e61b3a5c-listing_image_2.jpg',
  'https://media-fastly.hackerearth.com/media/hackathon/shift-hackathon-2022/images/9d2ff89433-V2_490x300_pixels_for_contests_page.png',
  'https://media-fastly.hackerearth.com/media/hackathon/october-circuits-22/images/847cdf2449-Listing.png',
  'https://media-fastly.hackerearth.com/media/hackathon/oppo-inspiration-cup/images/a9d54f5a28-Listing_1.png',
  'https://media-fastly.hackerearth.com/media/hackathon/dsa-coding-contest-october-22/images/00f7dbca43-Listing.png',
  'https://media-fastly.hackerearth.com/media/hackathon/flexcar-codeathon/images/e72dd12027-Flexcar_Hackathon_Listing_Image.png',
  'https://media-fastly.hackerearth.com/media/hackathon/buidl-the-future/images/700c45c24e-image_1_1.png',
  'https://media-fastly.hackerearth.com/media/hackathon/ibm-z-student-contest-2022/images/99ca390a0e-Listing2x.png',
  'https://media-fastly.hackerearth.com/media/hackathon/smart-odisha-hackathon-2018/images/6554ad2a60-0bd-2018-09-20.jpg',
  'https://media-fastly.hackerearth.com/media/hackathon/build-a-climate-fintech-app/images/d861775a2e-Listing.png',
  'https://media-fastly.hackerearth.com/media/hackathon/SORDI-ai-hackathon-2022/images/ba2e5d564f-Thumbnail1.png',
  'https://media-fastly.hackerearth.com/media/hackathon/intel-oneapi-hackathon-for-open-innovation/images/5c1cdef260-Listing.png',
  'https://media-fastly.hackerearth.com/media/hackathon/november-circuits-22/images/9c0ab00664-Listing.png',
  'https://media-fastly.hackerearth.com/media/hackathon/chhalaang-hack/images/b9b09ab650-Listing.png',
  'https://media-fastly.hackerearth.com/media/hackathon/the-epic-tournament/images/b7b10d6a65-EPIC_Tournament_-_HE_Listing.png',
  'https://media-fastly.hackerearth.com/media/hackathon/hack-the-journey-coding-india-edition-2022/images/e1b0f8b45c-Amadeus_Listing_1.png',
  'https://media-fastly.hackerearth.com/media/hackathon/ust-d3code-campus-hackathon22/images/d2e61b3a5c-listing_image_2.jpg',
  'https://media-fastly.hackerearth.com/media/hackathon/shift-hackathon-2022/images/9d2ff89433-V2_490x300_pixels_for_contests_page.png',
  'https://media-fastly.hackerearth.com/media/hackathon/dsa-coding-contest-november-22/images/7edcd7985f-Listing.png',
  'https://media-fastly.hackerearth.com/media/hackathon/november-easy-22/images/2d43595259-Listing.png',
  'https://media-fastly.hackerearth.com/media/hackathon/october-circuits-22/images/847cdf2449-Listing.png',
  'https://media-fastly.hackerearth.com/media/companies/fb4da9f-capillary_logo.png',
  'https://media-fastly.hackerearth.com/media/companies/d3b48b6-BuyerLogoLockupFullColor.jpg',
  'https://media-fastly.hackerearth.com/media/companies/c037243-drishti-stacked-rgb-logo_2021-09-28-202606_gygl.png',
  'https://media-fastly.hackerearth.com/media/companies/c037243-drishti-stacked-rgb-logo_2021-09-28-202606_gygl.png',
  'https://media-fastly.hackerearth.com/media/companies/ee3ed61-UI_logo.png',
  'https://media-fastly.hackerearth.com/media/companies/8b02bb0-Wipro_Primary_Logo_Color_RGB.png',
  'https://media-fastly.hackerearth.com/media/companies/1e1121b-truecaller.JPG'
]

const Quizzes = () => {
  const [quizzesData, setQuizzesData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState(() => null)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [filters, setFilters] = useState(null)
  const [loadingFilter, setLoadingFilter] = useState(false)

  useEffect(() => {
    setLoadingFilter(true)
    getRequest(
      `quizzes?page=${page}&itemsPerPage=${itemsPerPage}&` + serialize(query)
    )
      .then(response => {
        if (response.status === 200) {
          if (response.data.status) {
            setQuizzesData(response.data.result)
            setTotal(response.data.totalItems)
            setLoading(false)
            setLoadingFilter(false)
          }
        } else {
          setLoading(false)
          setLoadingFilter(false)
        }
      })
      .catch(err => {
        setLoading(false)
        setLoadingFilter(false)
        console.log(err)
        message.error('internal server error please try agin later')
      })
  }, [query, page, itemsPerPage])

  useEffect(() => {
    getRequest(`quizzes/filters`).then(response => {
      if (response.status === 200) {
        if (response.data.status) {
          setFilters(response.data.result)
        }
      } else {
      }
    })
  }, [])

  let i = 0
  const roundArray = index => {
    i = index
    for (let counter = 0; counter < 13; ++counter) {
      return (i = (i + 1) % images.length)
    }
  }

  const serialize = function (obj) {
    const query = obj
    if (query)
      Object.keys(query).forEach(key =>
        query[key] === undefined ? delete query[key] : console.log(key)
      )
    var str = []
    for (var p in query)
      if (query.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(query[p]))
      }
    return str.join('&')
  }

  return (
    <PageLayout breadcrumbs={BREADCRUMBS} loading={loading}>
      <Card>
        <h1
          style={{
            color: '#6e6b7b',
            fontWeight: 500,
            fontSize: '1.07rem',
            marginBottom: '1rem'
          }}
        >
          Filters
        </h1>
        <Form layout="vertical" initialValues={query}>
          <Row gutter={10}>
            <Col span={6}>
              <Form.Item
                style={{ width: '100%' }}
                name="specializationId"
                label="Specialization"
              >
                <Select
                  placeholder="select specialization"
                  allowClear
                  onChange={e => {
                    setQuery(prev => {
                      return { ...prev, specializationId: e }
                    })
                  }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children ?? '').includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.children ?? '')
                      .toLowerCase()
                      .localeCompare((optionB?.children ?? '').toLowerCase())
                  }
                  showSearch
                >
                  {filters
                    ?.map(s => s.Specialization)
                    .reduce((unique, o) => {
                      if (!unique.some(obj => obj.id === o.id)) {
                        unique.push(o)
                      }
                      return unique
                    }, [])
                    .map(option => (
                      <Select.Option key={option.id} value={option.id}>
                        {option.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                style={{ width: '100%' }}
                name="collegeId"
                label="College"
              >
                <Select
                  placeholder="select College"
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children ?? '').includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.children ?? '')
                      .toLowerCase()
                      .localeCompare((optionB?.children ?? '').toLowerCase())
                  }
                  showSearch
                >
                  {filters
                    ?.map(s => s.College)
                    .reduce((unique, o) => {
                      if (!unique.some(obj => obj.id === o.id)) {
                        unique.push(o)
                      }
                      return unique
                    }, [])
                    .map(option => (
                      <Select.Option key={option.id} value={option.id}>
                        {option.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                style={{ width: '100%' }}
                name="createdById"
                label="Created by"
              >
                <Select
                  placeholder="select faculty"
                  allowClear
                  onChange={e => {
                    setQuery(prev => {
                      return { ...prev, createdById: e }
                    })
                  }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children ?? '').includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.children ?? '')
                      .toLowerCase()
                      .localeCompare((optionB?.children ?? '').toLowerCase())
                  }
                  showSearch
                >
                  {filters
                    ?.map(s => s.User)
                    .reduce((unique, o) => {
                      if (!unique.some(obj => obj.id === o.id)) {
                        unique.push(o)
                      }
                      return unique
                    }, [])
                    .map(option => (
                      <Select.Option key={option.id} value={option.id}>
                        {option.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '70px'
        }}
      >
        <Pagination
          defaultCurrent={page}
          total={total}
          onChange={page => {
            setPage(page)
          }}
          current={page}
          pageSize={itemsPerPage}
          onShowSizeChange={(current, size) => {
            setItemsPerPage(size)
          }}
        />
      </div>
      <Divider orientationMargin={30} orientation={'left'}>
        <h1 style={{ fontSize: '25px', display: 'flex', alignItems: 'center' }}>
          Courses
          <p style={{ fontSize: '14px', margin: '0px 5px' }}>
            ( {total} results on Quizzer )
          </p>
        </h1>
      </Divider>
      <Spin spinning={loadingFilter} size="large">
        <Row gutter={20}>
          {quizzesData ? (
            quizzesData?.map((quiz, i) => (
              <Col
                key={quiz.id}
                xs={{
                  span: 24
                }}
                sm={{
                  span: 12
                }}
                md={{
                  span: 12
                }}
                lg={{
                  span: 8
                }}
                xl={{
                  span: 6
                }}
                xxl={{ span: 4 }}
              >
                <Link to={`/quizzes/${quiz.id}`}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt="example"
                        className="quiz-card-img"
                        src={
                          quiz.image.includes('quiz-school')
                            ? 'https://www.proprofs.com/' + quiz.image
                            : quiz.image
                        }
                        onError={e => {
                          e.target.onerror = null
                          e.target.src = images[roundArray(i)]
                        }}
                      />
                    }
                  >
                    <div>
                      <Card.Meta
                        style={{ marginBottom: '.7rem' }}
                        title={quiz.name}
                      />
                      <div className="quiz-card-items-container">
                        <Avatar
                          style={{
                            color: '#ea5455',
                            backgroundColor: 'rgba(234,84,85,.12)'
                          }}
                        >
                          {' '}
                          <b>
                            {quiz.User.name[0].toLocaleUpperCase() +
                              quiz.User.name
                                .split('')[1][0]
                                .toLocaleUpperCase()}
                          </b>
                        </Avatar>{' '}
                        <div
                          style={{
                            marginLeft: '0.4rem'
                          }}
                        >
                          <small
                            style={{
                              fontWeight: 400,
                              color: '#b9b9c3',
                              marginRight: '0.4rem'
                            }}
                          >
                            by
                          </small>
                          <small
                            style={{ color: '#6e6b7b', fontSize: '.857rem' }}
                          >
                            {quiz.User.name}
                          </small>
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Tag
                          style={{
                            marginBottom: '0.7rem',
                            borderRadius: '5px',
                            color: '#7367f0',
                            padding: '0px 0.5rem',
                            fontWeight: 600,
                            fontSize: '83%'
                          }}
                          color="rgba(115,103,240,.12)"
                        >
                          {quiz.Specialization.name}
                        </Tag>
                        <small
                          style={{
                            color: '#b9b9c3',
                            fontSize: '.857rem'
                          }}
                        >
                          {moment(new Date(quiz.createdAt)).format('MMM Do YY')}
                        </small>
                      </div>

                      <QuizCardStat
                        duration={quiz.duration}
                        users={quiz._count.Users}
                        questions={quiz._count.Questions}
                      />
                    </div>
                  </Card>
                </Link>
              </Col>
            ))
          ) : (
            <MessageCard
              status={403}
              title={'No Quiz found'}
              subTitle={
                'create some quiz and come back again. click on Create Quiz Button to add new Quiz'
              }
              btnLink={{
                text: 'Create Quiz',
                link: '/create',
                type: 'primary'
              }}
            />
          )}
        </Row>
      </Spin>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '50px 0px'
        }}
      >
        <Pagination
          defaultCurrent={page}
          total={total}
          onChange={page => {
            setPage(page)
          }}
          current={page}
          pageSize={itemsPerPage}
          onShowSizeChange={(current, size) => {
            setItemsPerPage(size)
          }}
        />
      </div>
    </PageLayout>
  )
}

export default Quizzes
