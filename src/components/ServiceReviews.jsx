import { Col, List, Row, Avatar, Space, Rate } from 'antd'
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons'
import '../css/ServiceReview.scss'
import React, { useEffect } from 'react'
import { timestamp2DateStr } from '../utils/TimeParser'
import '../css/ServiceReview.scss'

function MyList({ data }) {
  return (
    <List
      itemLayout='vertical'
      size='large'
      pagination={{
        onChange: page => {
          console.log(page)
        },
        pageSize: 5,
        align: 'center',
        style: {
          color: 'white',
        },
      }}
      dataSource={data}
      footer={
        <div style={{ color: 'aliceblue' }}>
          {/* TODO: add list footer */}
          <b>@ Find-A-Service</b> Team G15
        </div>
      }
      renderItem={item => (
        <List.Item
          style={{ borderColor: '#f0f8ff2b' }}
          className='review-list-item'
          key={item.title}
          actions={[
            <div className='review-date' style={{ color: 'aliceblue' }}>
              {timestamp2DateStr(item.date)}
            </div>,
          ]}
          extra={''}>
          <List.Item.Meta
            avatar={<Avatar src={item.author.user_avatar} />}
            title={<span style={{ color: 'yellow' }}>{item.title}</span>}
            description={
              <div className='rate-area' style={{ color: 'aliceblue' }}>
                {'@' + item.author.user_name + ' Rated: '}
                <Rate disabled value={item.rate} />
              </div>
            }
          />
          {<span style={{ color: 'aliceblue' }}>{item.content}</span>}
        </List.Item>
      )}
    />
  )
}

export default function ServiceReviews({ data }) {
  return (
    <Row className='review-list' justify='start'>
      <Col span={24}>{data ? <MyList data={data} /> : ''}</Col>
    </Row>
  )
}
