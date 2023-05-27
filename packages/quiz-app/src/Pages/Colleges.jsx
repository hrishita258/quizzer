import { Card, Space, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { getRequest } from '../axios/axiosMethods'
import PageLayout from '../components/PageLayout'
const Colleges = () => {
  const [collegesData, setColleges] = useState(null)
  const [loading, setLoading] = useState(true)
  const defaultExpandable = {
    expandedRowRender: record => <p>{record.description}</p>
  }
  const [expandable] = useState(defaultExpandable)
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
      width: 160
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Director Name',
      dataIndex: 'directorName',
      key: 'directorName'
    },
    {
      title: 'College Website',
      dataIndex: 'collegeWebsite',
      key: 'collegeWebsite'
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      )
    }
  ]

  const BREADCRUMBS = [
    {
      name: 'Home',
      link: {
        route: '/',
        key: 1
      }
    },
    {
      name: 'Colleges'
    }
  ]

  useEffect(() => {
    getRequest('colleges').then(response => {
      if (response.status === 200) {
        if (response.data.status) {
          setColleges(response.data.result)
        }
        setLoading(false)
      } else {
      }
    })
  }, [])

  return (
    <PageLayout breadcrumbs={BREADCRUMBS}>
      <Card>
        <Table
          size="small"
          scroll={{ x: 1024 }}
          expandable={expandable}
          rowKey={record => record.id}
          bordered
          columns={columns}
          loading={loading}
          dataSource={collegesData?.map((row, index) => {
            return {
              key: index,
              ...row
            }
          })}
        />
      </Card>
    </PageLayout>
  )
}
export default Colleges
