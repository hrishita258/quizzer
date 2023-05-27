import { Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import { getRequest } from '../axios/axiosMethods'
import Devfolio from '../components/Hackathons/Devfolio'
import DevPost from '../components/Hackathons/DevPost'
import HackerEarth from '../components/Hackathons/HackerEarth'
import MLH from '../components/Hackathons/MLH'
import Unstop from '../components/Hackathons/Unstop'
import PageLayout from '../components/PageLayout'

const Hackathons = () => {
  const [page, setPage] = useState(() => 1)
  const [devpostHackathons, setDevpostHackathons] = useState(() => [])
  const [activeTab, setActiveTab] = useState(() => '')
  const [loading, setLoading] = useState(() => true)

  const BREADCRUMBS = [
    {
      name: 'Home',
      link: {
        route: '/',
        key: 1
      }
    },
    {
      name: 'Hackathons'
    }
  ]

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tab = urlParams.get('tab')
    if (tab) setActiveTab(tab)
  }, [])

  useEffect(() => {
    getRequest('opportunity/hackathons/devpost?page_number=' + page).then(
      res => {
        const { result } = res.data
        if (res.status === 200)
          if (res.data.status === 200) {
            setDevpostHackathons([...devpostHackathons, ...result.results])
            setLoading(false)
          }
      }
    )
  }, [page])

  useEffect(() => {
    document.title = activeTab
    window.history.pushState(
      { path: '/opportunities' },
      '',
      'opportunities?tab=' + activeTab
    )
  }, [activeTab])

  return (
    <PageLayout breadcrumbs={BREADCRUMBS} loading={loading} noStyle>
      <div
        style={{
          backgroundColor: '#003e54',
          padding: '1rem'
        }}
      >
        <div style={{ maxWidth: '75rem', width: '100%', margin: '0px auto' }}>
          <h1
            style={{ fontSize: '2.25rem', color: '#FFF', textAlign: 'center' }}
          >
            Join the world's best online and in-person hackathons
          </h1>
        </div>
      </div>
      <div style={{ margin: '0px 2rem' }}>
        <Tabs
          defaultActiveKey={activeTab}
          size="large"
          onChange={e => {
            setActiveTab(e)
          }}
          items={[
            {
              label: 'Devpost',
              key: 'devpost',
              children: (
                <DevPost hackathons={devpostHackathons} page={setPage} />
              )
            },
            {
              label: 'Devfolio',
              key: 'devfolio',
              children: <Devfolio />
            },
            {
              label: 'Unstop',
              key: 'unstop',
              children: <Unstop />
            },
            {
              label: 'HackerEarth',
              key: 'hackerearth',
              children: <HackerEarth />
            },
            {
              label: 'Major League Hacking',
              key: 'mlh',
              children: <MLH />
            }
          ]}
        />
      </div>
    </PageLayout>
  )
}

export default Hackathons
