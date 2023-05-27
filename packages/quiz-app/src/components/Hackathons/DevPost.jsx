import {
  CalendarTwoTone,
  FlagTwoTone,
  GlobalOutlined,
  HomeTwoTone,
  TagsTwoTone
} from '@ant-design/icons'
import { Button, Card, Col, Image, Input, Row, Segmented, Tag } from 'antd'
import { convert } from 'html-to-text'
import React from 'react'

const DevPost = ({ page, hackathons }) => {
  return (
    <Row gutter={30} style={{ maxWidth: '1440px', margin: '0px auto' }}>
      <Col span={6}>
        <Card
          style={{
            height: 'calc(100vh - 80px)',
            position: 'sticky',
            top: 10,
            left: 0
          }}
        ></Card>
      </Col>
      <Col span={18}>
        <div
          style={{
            backgroundColor: '#FFF',
            marginBottom: '2rem',
            position: 'sticky',
            top: 0,
            padding: '1rem',
            zIndex: 1,
            boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}
        >
          <Input.Search
            size="large"
            style={{ width: '50%' }}
            placeholder="search by hackathon title or keyword"
            enterButton
          />
          <div
            style={{
              display: 'flex',
              marginTop: '1.5rem',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Showing 7582 hackathons</span>
            <Segmented
              style={{ width: '70%' }}
              block
              options={[
                'Most relevant',
                'Submission date',
                'Recently added',
                'Prize amount'
              ]}
            />
          </div>
        </div>
        <div style={{ margin: '0px auto' }}>
          {hackathons.map(hackathon => (
            <a href={hackathon.url} key={hackathon.id} target="__blank">
              <Card
                key={hackathon.id}
                bodyStyle={{
                  padding: 10,
                  position: 'relative',
                  paddingLeft: hackathon.featured ? 40 : 10
                }}
              >
                {hackathon.featured ? (
                  <div className="feat">
                    <div className="feat-child">FEATURED</div>
                  </div>
                ) : null}

                <div style={{ display: 'flex', gap: 20 }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: 20,
                      alignItems: 'center',
                      minWidth: '70%',
                      borderRight: '1px solid #e8e8e8',
                      paddingRight: 10
                    }}
                  >
                    <Image
                      width={200}
                      preview={false}
                      src={hackathon.thumbnail_url}
                    />
                    <div style={{ width: '100%' }}>
                      <h3 style={{ fontSize: '1.2rem' }}>{hackathon.title}</h3>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: 10
                        }}
                      >
                        <div style={{ width: '100%' }}>
                          <div style={{ marginBottom: 20 }}>
                            {hackathon.open_state === 'open' ? (
                              <Tag color="green">
                                {hackathon.time_left_to_submission}
                              </Tag>
                            ) : hackathon.open_state === 'upcoming' ? (
                              <Tag color={'orange'}>Upcoming</Tag>
                            ) : (
                              <Tag color="red">Ended</Tag>
                            )}
                          </div>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: '1rem',
                              marginLeft: '2px'
                            }}
                          >
                            {convert(hackathon.prize_amount)}{' '}
                            <span
                              style={{
                                fontWeight: 'normal',
                                color: 'gray'
                              }}
                            >
                              in prizes
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            width: '100%'
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              gap: 7,
                              marginBottom: 20
                            }}
                          >
                            {hackathon.displayed_location.icon === 'globe' ? (
                              <GlobalOutlined />
                            ) : (
                              <HomeTwoTone />
                            )}
                            <span>{hackathon.displayed_location.location}</span>
                          </div>
                          <div>
                            <b>{hackathon.registrations_count}</b>
                            <span style={{ marginLeft: 10 }}>participant</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: 15
                    }}
                  >
                    <div>
                      <FlagTwoTone />
                      <Tag color="blue" style={{ marginLeft: 10 }}>
                        {hackathon.organization_name}
                      </Tag>
                    </div>
                    <div>
                      <CalendarTwoTone />
                      <span style={{ marginLeft: 10 }}>
                        {hackathon.submission_period_dates}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <TagsTwoTone />
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 7
                        }}
                      >
                        {hackathon.themes.map(tag => (
                          <Tag key={tag.id} color="magenta">
                            {tag.name}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </a>
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: 25
            }}
          >
            <Button onClick={() => page(prev => prev + 1)}>Load more</Button>
          </div>
        </div>
      </Col>
    </Row>
  )
}
export default DevPost
