import { CloseCircleOutlined } from '@ant-design/icons'
import { Button, Result, Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const MessageCard = ({ status, title, subTitle, btnLink, List }) => {
  return (
    <div style={{ margin: '0px auto' }}>
      <Result
        status={status}
        title={title}
        subTitle={subTitle}
        extra={
          btnLink ? (
            <Link to={btnLink.link}>
              <Button type={btnLink.type} key="console">
                {btnLink.text}
              </Button>
            </Link>
          ) : null
        }
      >
        {List && List.item.length ? (
          <div className="desc">
            <Typography.Paragraph>
              <Typography.Text
                strong
                style={{
                  fontSize: 16
                }}
              >
                {List.title}
              </Typography.Text>
            </Typography.Paragraph>
            {List.item.map(l => (
              <Typography.Paragraph key={l}>
                {l.icon ? l.icon : <CloseCircleOutlined />}
                {l.text}
              </Typography.Paragraph>
            ))}
          </div>
        ) : null}
      </Result>
    </div>
  )
}

export default MessageCard
