import {
  Avatar,
  Breadcrumb,
  Col,
  Dropdown,
  Layout,
  Menu,
  Row,
  Skeleton
} from 'antd'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { MenuData } from '../data/MenuData'
import { useAppState } from '../state/AppState'
import { useMenuSelectedKeys } from '../state/MenuSelectedKeys'
const { Content } = Layout

const PageLayout = ({ children, breadcrumbs, loading, noStyle = false }) => {
  const { selectedKeys, setSelectedKeys } = useMenuSelectedKeys()
  const { appState } = useAppState()

  const getMenuChildren = data =>
    data.map(item => {
      if (item.show === false) return null
      if (appState.role === 'spoc' && appState.isAdmin) {
        if (item.role && !item.role?.includes('admin')) return null
      } else {
        if (item.role && !item.role?.includes(appState.role)) return null
      }
      if (item.children)
        return {
          key: item.key,
          label: item.label,
          children: getMenuChildren(item.children),
          icon: item.icon
        }
      else if (item.link)
        return {
          key: item.key,
          label: item.link.startsWith('http') ? (
            <a href={item.link} target="_blank" rel="noreferrer">
              {item.label}
            </a>
          ) : (
            <Link to={item.link}>{item.label}</Link>
          ),
          icon: item.icon,
          onClick: () => setSelectedKeys([item.key])
        }
      else return null
    })

  return (
    <Layout>
      {noStyle ? (
        loading ? (
          <Skeleton active />
        ) : (
          children
        )
      ) : (
        <>
          <Layout
            style={{
              paddingTop: '72px'
            }}
          >
            <Layout.Header
              style={{
                top: 0,
                position: 'fixed',
                width: '100%',
                zIndex: 29,
                boxShadow: '4px 4px 40px 0 rgb(0 0 0 / 5%)',
                transition: 'width .2s'
              }}
            >
              <Row>
                <Col
                  span={7}
                  style={{
                    display: 'flex',
                    height: '100%',
                    alignItems: 'center',
                    gap: 16
                  }}
                >
                  <Link
                    to="/"
                    style={{
                      fontSize: '18px',
                      fontWeight: 500,
                      width: 'max-content'
                    }}
                  >
                    Quizzer &copy;
                  </Link>
                </Col>
                <Col span={16}>
                  <Menu
                    selectedKeys={selectedKeys}
                    mode="horizontal"
                    items={getMenuChildren(MenuData)}
                  />
                </Col>
                <Col span={1}>
                  <Dropdown
                    menu={{
                      items: [
                        // {
                        //   key: '1',
                        //   label: (
                        //     // <Space>
                        //     //   <Switch
                        //     //     loading={
                        //     //       userPreferenceLoading ||
                        //     //       updatePreferenceLoading
                        //     //     }
                        //     //     checkedChildren={<FiMoon />}
                        //     //     unCheckedChildren={<FiSun />}
                        //     //     checked={
                        //     //       userPreference?.getUserPreference?.theme ===
                        //     //       'dark'
                        //     //         ? true
                        //     //         : false
                        //     //     }
                        //     //     onChange={async data => {
                        //     //       await updatePreference({
                        //     //         variables: {
                        //     //           theme: data ? 'dark' : 'light',
                        //     //           primaryColor:
                        //     //             userPreference?.getUserPreference
                        //     //               ?.primaryColor || '#1677FF',
                        //     //           showInactivesInSearch:
                        //     //             userPreference?.getUserPreference
                        //     //               ?.showInactivesInSearch || false
                        //     //         }
                        //     //       })
                        //     //       await refetch()
                        //     //     }}
                        //     //   />
                        //     //   <Switch
                        //     //     checkedChildren={<CheckOutlined />}
                        //     //     unCheckedChildren={<CloseOutlined />}
                        //     //     checked={showTabCloseWarning}
                        //     //     onChange={() =>
                        //     //       setShowTabCloseWarning(prev => !prev)
                        //     //     }
                        //     //   />
                        //     // </Space>
                        //   )
                        // },
                        {
                          key: '2',
                          label: <Link to="/account/profile">Profile</Link>
                        },
                        {
                          key: '3',
                          label: (
                            <Link to="/account/activeSessions">
                              Active Sessions
                            </Link>
                          )
                        },
                        {
                          key: '4',
                          label: (
                            <Link to="/account/updatePassword">
                              Update Password
                            </Link>
                          )
                        },
                        {
                          key: '5',
                          label: (
                            <Link to="/account/userPreference">
                              Preferences
                            </Link>
                          )
                        },
                        {
                          key: '6',
                          label: (
                            <Link
                              to="/"
                              onClick={async () => {
                                localStorage.removeItem('quiz-appState')
                                window.location.href = '/'
                              }}
                            >
                              Sign Out
                            </Link>
                          )
                        }
                      ]
                    }}
                    trigger={['click']}
                  >
                    <Avatar
                      style={{
                        marginLeft: 10,
                        cursor: 'pointer',
                        width: 43,
                        height: 43
                      }}
                      src={appState?.profileImg}
                    >
                      {!appState?.profileImg &&
                        appState?.fullname[0].toUpperCase()}
                    </Avatar>
                  </Dropdown>
                </Col>
              </Row>
            </Layout.Header>
            <Content
              style={{
                padding: '10px 50px',
                paddingTop: 8,
                minHeight: 'calc(100vh - 72px)'
              }}
            >
              {' '}
              <Breadcrumb separator=">" style={{ marginBottom: 20 }}>
                {breadcrumbs.map((b, i) => (
                  <Breadcrumb.Item key={i}>
                    {b.link ? (
                      <NavLink to={b.link.route}>{b.name}</NavLink>
                    ) : (
                      b.name
                    )}
                  </Breadcrumb.Item>
                ))}
              </Breadcrumb>
              {loading ? <Skeleton active /> : children}
            </Content>
          </Layout>
        </>
      )}
    </Layout>
  )
}

export default PageLayout
