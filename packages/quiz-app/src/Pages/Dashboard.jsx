import {
  Avatar,
  Button,
  Calendar,
  Card,
  Col,
  Image,
  Progress,
  Row,
  Tag
} from 'antd'
import React from 'react'
import { IoRibbonOutline } from 'react-icons/io5'
import PageLayout from '../components/PageLayout'

const Dashboard = () => {
  const BREADCRUMBS = [
    {
      name: 'Home',
      link: {
        route: '/',
        key: 1
      }
    }
  ]

  return (
    <PageLayout breadcrumbs={BREADCRUMBS}>
      <div>
        <Card
          style={{
            background:
              'url(https://static.vecteezy.com/system/resources/previews/001/987/747/original/abstract-white-and-blue-gradient-triangles-overlapping-background-free-vector.jpg)',
            width: '100%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0px 50px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  padding: 5,
                  background: '#FFF',
                  border: '1px solid lightgray',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Avatar
                  size={110}
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5GJoRJ64Qv4yF1e1CWg3LgtyCs-hG5-_Uiw&usqp=CAU"
                />
              </div>
              <div style={{ marginLeft: 20, color: 'black' }}>
                <h1 style={{ fontSize: '1.5rem' }}>Welcome, John Doe</h1>
                <p style={{ margin: 0, fontSize: '1rem' }}>
                  <span>Semester</span>
                  <strong style={{ marginLeft: 12 }}>8</strong>
                </p>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 15
              }}
            >
              <Image
                preview={false}
                height={100}
                src="https://d8it4huxumps7.cloudfront.net/uploads/images/62cfb2da5f01e_noto_trophy.svg"
              />
              <div>
                <h1 style={{ fontSize: '1.3rem', color: '#FFF' }}>
                  245 Points
                </h1>
                <Button type="primary">View Leaderboard</Button>
              </div>
            </div>
          </div>
        </Card>
        <Row style={{ marginTop: 50 }} gutter={50}>
          <Col span={17}>
            <Row gutter={20}>
              <Col span={24}>
                <h1 style={{ fontSize: '1.275rem' }}>Progress</h1>
              </Col>
              <Col span={17}>
                <Card
                  style={{
                    background: '#fff7e6',
                    border: '1px solid #ffd591'
                  }}
                  bodyStyle={{ padding: '10px 25px' }}
                >
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 15 }}
                  >
                    <div
                      style={{
                        padding: 10,
                        background: '#ffd591',
                        borderRadius: '10px'
                      }}
                    >
                      <IoRibbonOutline size={40} />
                    </div>
                    <Progress
                      percent={50}
                      status="active"
                      strokeColor="#d46b08"
                      showInfo={false}
                    />
                    <span>12/24</span>
                  </div>
                </Card>
                <Card></Card>
              </Col>
              <Col span={7}>
                <Card>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <strong
                      style={{
                        fontWeight: 600,
                        fontSize: '1.275rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10
                      }}
                    >
                      <h1
                        style={{
                          color: '#1890ff',
                          margin: 0
                        }}
                      >
                        8
                      </h1>
                      <span>Assigenments</span>
                    </strong>

                    <span
                      style={{
                        fontSize: '1rem',
                        color: '#e60000'
                      }}
                    >
                      4 overdues
                    </span>
                  </div>
                </Card>
                <Card>
                  <h1 style={{ textAlign: 'center', fontSize: '1.2rem' }}>
                    Overall Progress
                  </h1>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 20,
                      flexDirection: 'column',
                      gap: 25
                    }}
                  >
                    <Progress
                      type="circle"
                      percent={25}
                      strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                    />
                    <p style={{ fontSize: '1rem' }}>
                      Great work! Let's finish all your assesment{' '}
                    </p>
                  </div>
                </Card>
              </Col>
            </Row>
            <Card></Card>
          </Col>
          <Col span={7}>
            <Card></Card>
            <Card>
              <Calendar fullscreen={false} />
            </Card>
          </Col>
        </Row>
        <Card style={{ marginTop: 50 }}>
          <h1 style={{ fontSize: '1.275rem' }}>Assesment by Specializations</h1>
          <Row
            wrap={false}
            gutter={15}
            style={{ marginTop: 30, overflowX: 'auto' }}
          >
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <Col key={item} span={6} xxl={4}>
                <Card
                  style={{
                    marginBottom: 10
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 15
                    }}
                  >
                    <div style={{}}>
                      <Avatar
                        size={60}
                        shape="square"
                        style={{
                          color: '#fff',
                          backgroundColor:
                            '#' +
                            (((1 << 24) * Math.random()) | 0)
                              .toString(16)
                              .padStart(6, '0')
                        }}
                      >
                        <b> {item} C</b>
                      </Avatar>
                    </div>
                    <div>
                      <h1 style={{ fontSize: '1rem' }}>
                        Cloud Computing {item}
                      </h1>
                      <p style={{ fontSize: '1rem', margin: 0 }}>83%</p>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
        <Card style={{ marginTop: 50 }}>
          <h1 style={{ fontSize: '1.275rem' }}>Continue where you left off</h1>
          <Row
            wrap={false}
            gutter={15}
            style={{ marginTop: 30, overflowX: 'auto' }}
          >
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <Col key={item} span={6} xxl={4}>
                <Card
                  style={{
                    marginBottom: 10
                  }}
                  bodyStyle={{
                    padding: 10
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 7
                    }}
                  >
                    <Image
                      preview={false}
                      style={{ width: '100%', borderRadius: 7 }}
                      src="https://cdn.pixabay.com/photo/2019/05/22/22/28/brainstorm-4222728__340.jpg"
                    />
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <Tag color="blue" size="small">
                      Cloud Computing
                    </Tag>
                  </div>
                  <Card.Meta
                    title="lets start with the basics"
                    style={{
                      fontSize: '1.1rem',
                      marginTop: 7,
                      marginBottom: 7
                    }}
                  ></Card.Meta>
                  <Progress percent={50} status="active" />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </div>
    </PageLayout>
  )
}

export default Dashboard
