import { useEffect, useRef } from 'react'
import '../css/RequestCard.scss'
import { CheckCircleOutlined, ClockCircleOutlined, IssuesCloseOutlined, StopOutlined } from '@ant-design/icons'
import VanillaTilt from 'vanilla-tilt'
import { Col, Rate } from 'antd'
import { Link } from 'react-router-dom'
import { EditOutlined, EllipsisOutlined, PlayCircleOutlined, SettingOutlined } from '@ant-design/icons'
import { timestamp2DateStr } from '../utils/TimeParser'
export default function RequestCard({ data }) {
  const showStatus = (status = 'pending') => {
    if (status === 'pending')
      return (
        <div>
          <ClockCircleOutlined style={{ fontSize: '30px', color: '#08c' }} />
          <span>Pending</span>
        </div>
      )
    if (status === 'rejected')
      return (
        <div>
          <StopOutlined style={{ fontSize: '30px', color: '#08c' }} />
          <span>Rejected</span>
        </div>
      )
    if (status === 'accepted')
      return (
        <div>
          <PlayCircleOutlined style={{ fontSize: '30px', color: '#08c' }} />
          <span>Accepted</span>
        </div>
      )
    if (status === 'needDetail')
      return (
        <div>
          <IssuesCloseOutlined style={{ fontSize: '30px', color: '#08c' }} />
          <span>More detail required</span>
        </div>
      )
    if (status === 'completed')
      return (
        <div>
          <CheckCircleOutlined style={{ fontSize: '30px', color: '#08c' }} />
          <span>Done</span>
        </div>
      )
  }

  // console.log('getdata', data.req_id)

  const cardDOM = useRef(null)
  useEffect(() => {
    // const cardElem = document.querySelector('.card')
    VanillaTilt.init(cardDOM.current, {
      max: 30,
      speed: 3000,
    })
    console.log('in request card', data)
  }, [])

  const handleCardClick = _ => {
    // console.log('我是data', data)
    // console.log('Card Clicked, req_id: ', data.req_id)
    window.location.href = '/service-provider/request-detail/' + data.req_id
  }

  return (
    // onClick={() => handleCardClick(data)}
    <div className='card'>
      <Col className='wrap'>
        <div className='request-card' ref={cardDOM}>
          {/* <div className='image'>TODO: img 404</div> */}
          {showStatus(data ? data.status : 0)}

          <div className='details'>
            <h1>{data ? data.srv_name : 'Service Name'}</h1>
            {/* <h3>{'From User :' + (data ? data.user_id : 'User')}</h3> */}
            <h3>{data ? timestamp2DateStr(data.req_time) : 'Time'}</h3>
            <p>{data ? data.description : 'Brief description of the service'}</p>
          </div>
        </div>
      </Col>
    </div>
  )
}
