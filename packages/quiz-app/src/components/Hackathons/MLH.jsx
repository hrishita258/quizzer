import { Card, Col, Image, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { getRequest } from '../../axios/axiosMethods'

const MLH = () => {
  const [hackathons, setHackathons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRequest('opportunity/mlh/challenges')
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === 200) {
            setHackathons(res.data.result?.results)
            setLoading(false)
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <div style={{ margin: '0px auto', maxWidth: '1180px' }}>
      <Row gutter={25}>
        {hackathons.map(hackathon => (
          <Col key={hackathon.id} span={6}>
            <a href={hackathon?.url} target="__blank">
              <Card
                hoverable
                cover={
                  <div style={{ position: 'relative' }}>
                    <Image
                      alt={hackathon.title}
                      src={hackathon.imageUrl}
                      style={{ padding: '0.7rem' }}
                      preview={false}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-10px',
                        width: '70px',
                        height: '70px',
                        backgroundColor: '#FFF',
                        padding: '4px',
                        left: '50%',
                        marginLeft: '-30px',
                        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.40)',
                        borderRadius: '7%'
                      }}
                    >
                      <Image
                        alt={hackathon.title}
                        preview={false}
                        src={hackathon?.logoUrl}
                        style={{
                          borderRadius: '7%'
                        }}
                      />
                    </div>
                  </div>
                }
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <h3 style={{ textAlign: 'center', margin: '0px' }}>
                    <strong> {hackathon.title}</strong>
                  </h3>
                  <p
                    style={{
                      color: '#989898',
                      textTransform: 'capitalize',
                      margin: 0,
                      marginTop: '4px'
                    }}
                  >
                    {hackathon?.date}
                  </p>
                  <h4>
                    <span>{hackathon?.location?.city}</span>,{' '}
                    <span>{hackathon?.location?.state}</span>
                  </h4>
                  <p
                    style={{
                      color: '#989898',
                      textTransform: 'capitalize',
                      margin: 0,
                      marginTop: '4px'
                    }}
                  >
                    {hackathon?.type}
                  </p>
                </div>
              </Card>
            </a>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default MLH
