import { Card, Col, Image, Row, Space, Table, Tag } from 'antd'

const LeaderBoard = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green'
            if (tag === 'loser') {
              color = 'volcano'
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            )
          })}
        </>
      )
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
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer']
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser']
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher']
    },
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer']
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser']
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher']
    },
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer']
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser']
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher']
    },

    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer']
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser']
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher']
    },
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer']
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser']
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher']
    },
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer']
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser']
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher']
    },
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer']
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser']
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher']
    }
  ]
  return (
    <Card
      style={{
        maxWidth: '1330px',
        margin: '0px auto',
        position: 'relative',
        height: '100%',
        borderRadius: 0
      }}
      bodyStyle={{ padding: 0, position: 'relative' }}
    >
      <Image
        style={{ width: '100%', height: 'auto' }}
        src="https://www.freeiconspng.com/uploads/confetti-png-21.png"
        alt="Png Download Confetti Clipart"
        preview={false}
      />
      <div
        style={{
          position: 'absolute',
          top: '100px',
          width: '100%',
          padding: '0px 100px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              fontSize: '22px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}
          >
            <Image
              preview={false}
              src={
                'https://d8it4huxumps7.cloudfront.net/uploads/images/62cfb2da5f01e_noto_trophy.svg'
              }
            />
            <strong>LEADERBOARD</strong>
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          marginTop: '-180px'
        }}
      >
        <Row gutter={15} style={{ maxWidth: '1000px', margin: '0px auto' }}>
          <Col span={7}>
            <Card></Card>
          </Col>
          <Col span={10}>
            <Card
              style={{
                backgroundColor: '#fff7e2'
              }}
              bodyStyle={{
                paddingBottom: '5px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  margin: '-70px auto',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  width: '90px',
                  height: '90px',
                  boxShadow: '0px 0px 10px 0px #0000001a',
                  padding: '5px'
                }}
              >
                <Image
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    margin: '0px auto',
                    display: 'block'
                  }}
                  src="https://png.pngtree.com/png-vector/20190704/ourlarge/pngtree-vector-user-young-boy-avatar-icon-png-image_1538408.jpg"
                  alt="Png Download Confetti Clipart"
                  preview={false}
                />
              </div>
              <div
                style={{
                  textAlign: 'center',
                  color: '#1c4980',
                  marginTop: '80px'
                }}
              >
                <h1 style={{ margin: 0 }}>Jhon doe</h1>
                <h2>
                  <span>Points - </span>
                  <span>1925</span>
                </h2>
              </div>
              <div
                style={{
                  textAlign: 'center',
                  color: '#fff',
                  backgroundColor: '#ffb800',
                  padding: '5px 0px',
                  borderRadius: '5px',
                  fontSize: '18px'
                }}
              >
                <b>1st Place</b>
              </div>
            </Card>
          </Col>
          <Col span={7}>
            <Card></Card>
          </Col>
        </Row>
      </div>
      <div style={{ padding: '0px 33px', marginTop: 60 }}>
        <Table
          columns={columns}
          dataSource={data.map((s, index) => {
            return {
              ...s,
              key: index
            }
          })}
        />
      </div>
    </Card>
  )
}

export default LeaderBoard
