import { MoreOutlined } from '@ant-design/icons'
import { Dropdown, message } from 'antd'
import React from 'react'
const onClick = ({ key }) => {
  message.info(`Click on item ${key}`)
}

const DropOptions = ({ items }) => {
  return (
    <Dropdown
      menu={{
        items,
        onClick
      }}
    >
      <a onClick={e => e.preventDefault()}>
        <MoreOutlined />
      </a>
    </Dropdown>
  )
}
export default DropOptions
