import React from 'react'
import '../css/RequestInfo.scss'
import { Col, Divider, Row } from 'antd'
import { timestamp2DateStr } from '../utils/TimeParser.js'
export const RequestCard = ({ data }) => {
  // const formattedTime = new Date(req_time).toLocaleString()
  // console.log('in request card', data)
  return (
    <div className='request-card-container'>
      <div className='request-card-header'>
        {/* <h2 className='request-card-title'>{'From:  ' + (data && data.user_id)}</h2> */}
        <h2 className='request-card-subtitle'>{'Service:' + (data && data.srv_name)}</h2>
      </div>
      <Divider
        style={{
          color: 'white',
          backgroundColor: 'white',
          height: '1px',
        }}
      />
      <div>
        <Row>
          <Col span={12}>
            <div className='request-card-body'>
              <h2 className='request-card-description'>{'Description: '}</h2>
              <p className='request-card-description'>{data && data.desc}</p>
            </div>
          </Col>
          <Col span={12}>
            <div className='request-card-footer'>
              <h2 className='request-card-time'>{'Created Time:'}</h2>
              <p className='request-card-time'>{data && timestamp2DateStr(data.req_time)}</p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default RequestCard
