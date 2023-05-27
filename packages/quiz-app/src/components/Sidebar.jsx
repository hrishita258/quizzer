import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined
} from '@ant-design/icons'
import { Image, Layout, Menu } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const { Sider } = Layout
const items = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`
}))

const Sidebar = ({ collapsed }) => {
  return (
    <Sider
      trigger={null}
      collapsible
      theme="light"
      collapsed={collapsed}
      style={{
        boxShadow: '0 0 28px 0 rgb(24 144 255 / 10%)',
        maxWidth: '200px',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 10
      }}
    >
      <div
        className="logo"
        style={{
          boxShadow: '0 1px 9px -3px rgb(0 0 0 / 20%)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Image
            style={{
              maxWidth: '65px'
            }}
            preview={false}
            src="https://static.vecteezy.com/system/resources/thumbnails/002/958/141/small/exam-and-quiz-vector.jpg"
          />
          <h1 style={{ fontSize: '16px', color: 'blue', margin: 0 }}>
            Quizzer
          </h1>
        </div>
      </div>
      <Menu
        mode="inline"
        style={{ padding: '24px 0px' }}
        defaultSelectedKeys={['1']}
        items={[
          {
            key: '1',
            icon: <UserOutlined />,
            label: <Link to={'/'}>Dashboard</Link>
          },
          {
            key: '2',
            icon: <VideoCameraOutlined />,
            label: <Link to={'/users'}>Users</Link>
          },
          {
            key: '3',
            icon: <UploadOutlined />,
            label: <Link to={'/colleges'}>Colleges</Link>
          },
          {
            key: '4',
            icon: <AppstoreOutlined />,
            label: <Link to={'/quizzes'}>Quizzes</Link>
          }
        ]}
      />
    </Sider>
  )
}

export default Sidebar
