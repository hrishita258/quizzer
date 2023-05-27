import {
  Badge,
  Button,
  Card,
  Col,
  Image,
  Input,
  Row,
  Segmented,
  Tag
} from 'antd'
import React, { useEffect, useState } from 'react'
import { AiOutlineEye, AiOutlineUsergroupAdd } from 'react-icons/ai'
import { BiTimeFive } from 'react-icons/bi'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Link } from 'react-router-dom'
import { getRequest } from '../../axios/axiosMethods'

const Unstop = () => {
  const [opportunities, setOpportunities] = useState([])
  const [featured, setFeatured] = useState()
  const [page, setPage] = useState(0)

  useEffect(() => {
    getRequest('opportunity/hackathons/unstop/featured')
      .then(res => {
        setFeatured(JSON.parse(res.data.result))
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    getRequest('opportunity/hackathons/unstop?page_number=' + page)
      .then(res => {
        setOpportunities([...opportunities, ...res.data.result.hits])
        console.log(res.data)
      })
      .catch(err => {
        console.log(err)
      })
    setPage(page + 12)
  }

  const refresh = setItems => {}

  const filters = [
    { name: 'All' },
    { name: 'Competitions' },
    { name: 'Hiring Challenges' },
    { name: 'Quizzes' },
    { name: 'Hackathons' },
    { name: 'Internships' },
    { name: 'Scholarships' },
    { name: 'Workshops' },
    { name: 'Jobs' },
    { name: 'Conferences' },
    { name: 'Cultural Events' },
    { name: 'College Festivals' },
    { name: 'Articals' }
  ]

  return (
    <div
      style={{
        maxWidth: '1500px',
        margin: '0px auto',
        position: 'relative'
      }}
    >
      <Card
        style={{ position: 'sticky', top: 0, zIndex: 1000, padding: 0 }}
        bodyStyle={{ padding: 10 }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '40%' }}>
            <Input.Search
              placeholder="input search text"
              allowClear
              enterButton="Search"
              size="large"
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
            marginTop: 13,
            overflowX: 'scroll'
          }}
        >
          <Segmented options={filters.map(f => f.name)} size="large" />
        </div>
      </Card>
      <Row gutter={30} style={{ position: 'relative' }}>
        <Col span={6}>
          <Card
            bodyStyle={{ padding: 7 }}
            style={{
              position: 'sticky',
              top: 135,
              width: '100%',
              right: 0,
              height: 'calc(100vh - 150px)',
              overflowY: 'scroll'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 5,
                borderBottom: '1px solid #e8e8e8'
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 600, color: 'gray' }}>
                Filters
              </span>
              <Button type="link">Reset</Button>
            </div>
          </Card>
        </Col>
        <Col span={12} style={{ margin: 0, padding: 0 }}>
          <InfiniteScroll
            dataLength={opportunities?.length} //This is important field to render the next data
            next={() => {
              fetchData()
            }}
            style={{ padding: '12px', width: '100%' }}
            hasMore={true}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
            // below props only if you need pull down functionality
            refreshFunction={refresh}
            pullDownToRefresh
            pullDownToRefreshThreshold={50}
            pullDownToRefreshContent={
              <h3 style={{ textAlign: 'center' }}>
                &# 8595; Pull down to refresh
              </h3>
            }
            releaseToRefreshContent={
              <h3 style={{ textAlign: 'center' }}>
                &# 8593; Release to refresh
              </h3>
            }
          >
            {opportunities?.map(opportunity => (
              <Link
                to={`/opportunities/unstop/${opportunity.id}`}
                key={opportunity.id}
              >
                <Badge.Ribbon
                  text="Paid"
                  key={opportunity.id}
                  style={{ display: opportunity.isPaid ? '' : 'none' }}
                >
                  <Card
                    hoverable
                    key={opportunity.id}
                    bodyStyle={{ padding: 5 }}
                    style={{ borderRadius: '16px' }}
                  >
                    <div
                      style={{ display: 'flex', gap: 15, alignItems: 'center' }}
                    >
                      <div style={{ padding: 7 }}>
                        <Image
                          style={{ borderRadius: '16px' }}
                          src={opportunity.banner_mobile.image_url}
                          preview={false}
                          width={280}
                          height={160}
                        />
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignContent: 'space-between',
                          flexDirection: 'column',
                          width: '100%',
                          paddingRight: 10
                        }}
                      >
                        <div>
                          <h3>{opportunity.title}</h3>
                          <p>{opportunity.organisation.name}</p>
                        </div>
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              color: '#ea4c89'
                            }}
                          >
                            {opportunity.viewsCount ||
                            opportunity.registerCount ? (
                              <span
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  gap: 7
                                }}
                              >
                                {!opportunity.registerCount ? (
                                  <>
                                    <AiOutlineEye style={{ fontSize: 20 }} />
                                    {opportunity.viewsCount + ' Impressions'}
                                  </>
                                ) : (
                                  <>
                                    <AiOutlineUsergroupAdd
                                      style={{ fontSize: 20 }}
                                    />
                                    {opportunity.registerCount +
                                      ' Registrations'}
                                  </>
                                )}
                              </span>
                            ) : null}
                            {opportunity.regnRequirements.remain_days ? (
                              <span
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  gap: 7
                                }}
                              >
                                <BiTimeFive style={{ fontSize: 20 }} />
                                {opportunity.regnRequirements.remain_days}
                              </span>
                            ) : null}
                          </div>
                          <div
                            style={{
                              marginTop: 12,
                              display: 'flex',
                              rowGap: 7,
                              flexWrap: 'wrap'
                            }}
                          >
                            <Tag color="red">{opportunity.type}</Tag>
                            {opportunity.filters
                              .filter(f => f.type === 'eligible')
                              .map(tag => (
                                <Tag key={tag.id} color="blue">
                                  {tag.name}
                                </Tag>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Badge.Ribbon>
              </Link>
            ))}
          </InfiniteScroll>
        </Col>
        <Col span={6}>
          <Card
            style={{
              position: 'sticky',
              top: 135,
              width: '100%',
              right: 0,
              height: 'calc(100vh - 150px)',
              overflowY: 'scroll'
            }}
            bodyStyle={{ padding: 7 }}
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <h2>Featured</h2>
            </div>
            {featured?.data.map(feature => (
              <div key={feature.id} style={{ padding: 7, marginBottom: 7 }}>
                <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                  <div
                    style={{
                      padding: 7,
                      width: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '80px',
                      overflow: 'hidden',
                      transition: '.3s',
                      position: 'relative',
                      zIndex: 0,
                      background: '#FFFFFF',
                      border: '1px solid rgba(114,131,161,.1)',
                      boxSizing: 'border-box',
                      boxShadow: '0 0 10px #186edf1a',
                      borderRadius: '8px'
                    }}
                  >
                    <Image src={feature.logoUrl2} preview={false} />
                  </div>
                  <span
                    style={{
                      width: '70%',
                      marginBottom: 0,
                      transition: '.3s',
                      color: '#455368',
                      fontWeight: 500,
                      fontSize: '13px',
                      lineHeight: '140%',
                      WebkitLineClamp: 4
                    }}
                  >
                    {feature.featured_title
                      ? feature.featured_title
                      : feature.type
                      ? feature.title
                      : feature.name}
                  </span>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
export default Unstop
