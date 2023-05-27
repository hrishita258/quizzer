import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Image,
  Input,
  message,
  Popconfirm,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tag
} from 'antd'
import React, { useEffect, useState } from 'react'
import { FaUserCheck, FaUserGraduate, FaUsers, FaUserTie } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { getRequest, postRequest } from '../axios/axiosMethods'
import DropOptions from '../components/DropOptions'
import PageLayout from '../components/PageLayout'
const Users = () => {
  //? states
  const [usersData, setUsers] = useState(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState('student')
  const [colleges, setColleges] = useState(null)
  const [specialization, setSpecialization] = useState(null)
  const [error, setError] = useState(null)

  //? refs
  const [form] = Form.useForm()

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'name',
      key: 'avatar',
      width: '4%',
      fixed: 'left',
      align: 'center',
      render: text => (
        <Avatar
          style={{ marginLeft: 8, backgroundColor: '#f56a00', color: '#fff' }}
        >
          {text[1].toLocaleUpperCase()}
        </Avatar>
      )
    },

    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
      width: 170
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200
    },

    {
      title: 'College',
      dataIndex: 'College',
      key: 'College',
      render: col => (col && col.name ? col.name : ''),
      width: 180,
      onFilter: (value, record) => record.name.indexOf(value) === 0
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
      render: col => (col ? <Tag color="magenta">{col}</Tag> : '-'),
      width: 70,
      align: 'center'
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 70,
      align: 'center',
      filters: [
        { text: 'spoc', value: 'spoc' },
        { text: 'student', value: 'student' },
        { text: 'faculty', value: 'faculty' }
      ],
      onFilter: (value, record) => record.role.indexOf(value) === 0
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 70,
      align: 'center',
      filters: [
        { text: 'Male', value: 'Male' },
        { text: 'Female', value: 'Female' }
      ],
      onFilter: (value, record) => record.gender.indexOf(value) === 0
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 70,
      align: 'center',
      render: col =>
        col ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Deactivate</Tag>
        )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}
        >
          <Link to={`/users/${record.id}`}>
            <span href="#">View</span>
          </Link>
          <DropOptions
            items={[
              {
                label: 'edit',
                key: '1'
              },
              {
                label: 'delete',
                key: '2'
              }
            ]}
          />
        </div>
      ),
      width: '6%',
      fixed: 'right'
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
      name: 'Users'
    }
  ]
  const getUsers = () => {
    getRequest('users')
      .then(response => {
        if (response.status === 200) {
          if (response.data.status) {
            setUsers(response.data.result)
          }
          setLoading(false)
        } else {
        }
      })
      .catch(err => {
        setLoading(false)
        message.error('internal server error please try agin later')
      })
  }

  useEffect(() => {
    getUsers()
    getRequest('colleges')
      .then(response => {
        if (response.status === 200) {
          if (response.data.status) {
            setColleges(response.data.result)
          }
        } else {
        }
      })
      .catch(err => {
        message.error('internal server error please try agin later')
      })
  }, [])

  const getSpecializations = collegeId => {
    setSpecialization(
      colleges.find(college => college.id === collegeId).specializations
    )
  }

  return (
    <PageLayout breadcrumbs={BREADCRUMBS}>
      <Row gutter={25}>
        <Col span={5}>
          <Card bodyStyle={{ padding: '10px 24px' }}>
            <div
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
                  <b>{usersData?.length}</b>
                </h1>
                <p
                  style={{
                    fontSize: '1rem',
                    fontWeight: 400
                  }}
                >
                  Total Users
                </p>
              </div>
              <div>
                <Avatar
                  size={55}
                  style={{
                    color: '#7367f0',
                    backgroundColor: 'rgba(115,103,240,.12)',
                    fontSize: '2rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <FaUsers />
                </Avatar>
              </div>
            </div>
          </Card>
        </Col>

        <Col span={5}>
          <Card bodyStyle={{ padding: '10px 24px' }}>
            <div
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
                  <b>{usersData?.filter(s => s?.role === 'student')?.length}</b>
                </h1>
                <p
                  style={{
                    fontSize: '1rem',
                    fontWeight: 400
                  }}
                >
                  Total Students
                </p>
              </div>
              <div>
                <Avatar
                  size={55}
                  style={{
                    color: '#ff9f43',
                    backgroundColor: '#rgba(255,159,67,.12)',
                    fontSize: '2rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <FaUserGraduate />
                </Avatar>
              </div>
            </div>
          </Card>
        </Col>

        <Col span={5}>
          <Card bodyStyle={{ padding: '10px 24px' }}>
            <div
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
                  <b>{usersData?.filter(s => s?.role === 'faculty')?.length}</b>
                </h1>
                <p
                  style={{
                    fontSize: '1rem',
                    fontWeight: 400
                  }}
                >
                  Total Faculties
                </p>
              </div>
              <div>
                <Avatar
                  size={55}
                  style={{
                    color: '#ea5455',
                    backgroundColor: 'rgba(234,84,85,.12)',
                    fontSize: '2rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <FaUserTie />
                </Avatar>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={5}>
          <Card bodyStyle={{ padding: '10px 24px' }}>
            <div
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
                  <b>{usersData?.filter(s => s.isActive)?.length}</b>
                </h1>
                <p
                  style={{
                    fontSize: '1rem',
                    fontWeight: 400
                  }}
                >
                  Active Users
                </p>
              </div>
              <div>
                <Avatar
                  size={55}
                  style={{
                    color: '#28c76f',
                    backgroundColor: 'rgba(40,199,111,.12)',
                    fontSize: '2rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <FaUserCheck />
                </Avatar>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card bodyStyle={{ padding: 0 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: '33.33%' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    marginTop: '1.5rem'
                  }}
                >
                  <Image
                    width={60}
                    preview={false}
                    src="https://pixinvent.com/demo/vuexy-react-admin-dashboard-template/demo-1/assets/faq-illustrations.0a8a9367.svg"
                  />
                </div>
              </div>
              <div
                style={{
                  width: '66.66%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-evenly',
                  flexDirection: 'column',
                  alignContent: 'space-between',
                  paddingRight: '1rem'
                }}
              >
                <Button type="primary" onClick={() => setOpen(true)}>
                  Add New User
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <Card>
        <Table
          style={{ fontSize: '12px' }}
          size="small"
          bordered
          scroll={{ x: 1400 }}
          rowKey={record => record.id}
          columns={columns}
          loading={loading}
          dataSource={usersData?.map((row, index) => {
            return {
              key: index,
              ...row
            }
          })}
        />
      </Card>
      {/* add user form */}
      <Drawer
        title="Create new user"
        size="large"
        placement="right"
        closable={false}
        open={open}
        extra={
          <Space>
            <Popconfirm
              title="Are you sure to leave?"
              onConfirm={() => {
                setOpen(false)
                form.resetFields()
                setSpecialization(null)
                setRole(null)
                setError(null)
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button>Cancel</Button>
            </Popconfirm>

            <Button type="primary" onClick={() => form.submit()}>
              Submit
            </Button>
          </Space>
        }
      >
        <Form
          layout="vertical"
          initialValues={{ role: 'student' }}
          form={form}
          onFinish={values => {
            postRequest('users', {
              ...values,
              semester: parseInt(values.semester),
              enrollmentYear: parseInt(values.enrollmentYear)
            })
              .then(response => {
                if (response.status === 200) {
                  if (response.data.status === 200) {
                    message.success(response.data.result)
                    getUsers()
                  }
                  if (response.data.status === 400) {
                    console.log(response.data.error)
                    setError(response.data.error)
                  }
                }
              })
              .catch(err => {
                message.error('internal server error please try agin later')
              })
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              {error !== null ? (
                <Alert
                  message="already exists"
                  showIcon
                  description={
                    <div>
                      {error.map(err => (
                        <p key={err}>{err}</p>
                      ))}
                    </div>
                  }
                  type="error"
                />
              ) : null}
            </Col>
            <Col span={24}>
              <Form.Item name="role" label="Role">
                <Radio.Group onChange={role => setRole(role.target.value)}>
                  <Radio value={'spoc'}>
                    <Card>SPOC</Card>
                  </Radio>
                  <Radio value={'faculty'}>
                    <Card>Faculty</Card>
                  </Radio>
                  <Radio value={'student'}>
                    <Card>Student</Card>
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                rules={[
                  { required: true, message: 'Please input user name!' },
                  { min: 4, message: 'Name must be at least 4 characters' }
                ]}
                label="Name"
              >
                <Input placeholder="Please enter user name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Please input user email!'
                  },
                  {
                    type: 'email',
                    message: 'Please input valid email!'
                  }
                ]}
                label="Email"
              >
                <Input type="email" placeholder="Please enter user email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="collegeId" label="College">
                <Select
                  placeholder="Please select college"
                  options={colleges?.map(college => {
                    return {
                      label: college.name,
                      value: college.id
                    }
                  })}
                  onChange={value => getSpecializations(value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="specializationId" label="Specialization">
                <Select
                  placeholder="Please select a specialization"
                  options={specialization?.map(spec => {
                    return {
                      label: spec.name,
                      value: spec.id
                    }
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contactNumber" label="Contact Number">
                <Input
                  type="number"
                  placeholder="Please enter user mobile number"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: 'Please select gender!' }]}
              >
                <Input
                  type="text"
                  placeholder="Please enter user mobile number"
                />
              </Form.Item>
            </Col>
            {role === 'student' ? (
              <>
                <Col span={12}>
                  <Form.Item
                    name="semester"
                    rules={[
                      {
                        required: true,
                        message: 'Please input student semester'
                      },
                      { min: 1, message: 'Semester must be at least 1' },
                      { max: 8, message: 'Semester must be at most 8' }
                    ]}
                    label="Semester"
                  >
                    <Input type="number" placeholder="Please enter user name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="enrollmentYear"
                    rules={[
                      {
                        required: true,
                        message: 'Please input student enrollment year'
                      }
                    ]}
                    label="Enrollment Year"
                  >
                    <Input type="number" placeholder="Please enter user name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="github" label="Github Profile">
                    <Input
                      style={{ width: '100%' }}
                      addonBefore="https://"
                      addonAfter=".com"
                      placeholder="Please enter github public url"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="linkedin" label="Linkedin Profile">
                    <Input
                      style={{ width: '100%' }}
                      addonBefore="https://"
                      addonAfter=".com"
                      placeholder="Please enter linkedin profile url"
                    />
                  </Form.Item>
                </Col>
              </>
            ) : null}
          </Row>
        </Form>
      </Drawer>
      {/* add user form end */}
    </PageLayout>
  )
}
export default Users
