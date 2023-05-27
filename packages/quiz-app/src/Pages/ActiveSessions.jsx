import { DesktopOutlined } from '@ant-design/icons'
import { Button, Card, Col, message, Row } from 'antd'
import DeviceDetector from 'device-detector-js'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { postRequest } from '../axios/axiosMethods'
import PageLayout from '../components/PageLayout'
import { useAppState } from '../state/AppState'

const TITLE = 'Active Sessions'

const BREADCRUMBS = [
  {
    name: 'Home',
    link: {
      route: '/',
      key: '1'
    }
  },
  {
    name: 'Account'
  },
  {
    name: TITLE
  }
]

const ActiveSessions = () => {
  const [activeSessions, setActiveSessions] = useState()
  const [loading, setLoading] = useState(true)
  const { appState } = useAppState()

  useEffect(() => {
    postRequest('activeSessions', { token: appState.refreshToken })
      .then(response => {
        if (response.status === 200) {
          if (response.data.status) {
            setActiveSessions(response.data.result)
          }
          setLoading(false)
        } else {
        }
      })
      .catch(err => {
        setLoading(false)
        message.error('internal server error please try agin later')
      })
  }, [])

  const deviceDetector = new DeviceDetector()

  const session = activeSessions?.map(ses => {
    const parsed = deviceDetector.parse(ses.userAgent)
    return { ...ses, parsed }
  })

  return (
    <PageLayout breadcrumbs={BREADCRUMBS} loading={loading}>
      <Row gutter={30}>
        {session?.map(session => (
          <Col span={6} key={session.id}>
            <Card>
              <h5>
                <b>Started on: </b>
                {moment(session.createdAt).format('MMM Do YYYY, h:mm a')}
              </h5>
              <h5>
                <b>Last Seen: </b>
                {moment(session.updatedAt).format('MMM Do YYYY, h:mm a')}
              </h5>
              <h3 style={{ color: '#00a8ff', marginTop: 15 }}>Client</h3>
              <div>Name : {session.parsed.client?.name}</div>
              <div>Type : {session.parsed.client?.type}</div>
              <div style={{ marginBottom: 10 }}>
                Version : {session.parsed.client?.version}
              </div>
              <div style={{ display: 'flex', alignItems: 'end', gap: 20 }}>
                <div>
                  <h3 style={{ color: '#00a8ff', margin: 0 }}>Device</h3>
                  <div style={{ marginBottom: 15 }}>
                    Type : {session.parsed.device?.type}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '70px',
                    width: '50px'
                  }}
                >
                  <DesktopOutlined
                    style={{ fontSize: '50px', color: '#fa8c16' }}
                  />
                </div>
              </div>
              <h3 style={{ color: '#00a8ff' }}>OS</h3>
              <div>Name : {session.parsed.os?.name}</div>
              <div>Platform : {session.parsed.os?.platform}</div>
              <div
                style={{
                  margin: '10px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end'
                }}
              >
                {console.log(session)}
                <Button
                  type="primary"
                  // onClick={() => deleteSession(session.id)}
                  disabled={session.token ? true : false}
                >
                  {session.token ? 'Current' : 'Remove'}
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </PageLayout>
  )
}

export default ActiveSessions
