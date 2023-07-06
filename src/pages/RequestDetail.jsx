import React from 'react'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import { motion } from 'framer-motion'
import { CheckCircleTwoTone } from '@ant-design/icons'
import 'react-vertical-timeline-component/style.min.css'
import { Button, Row, Col } from 'antd'
import RequestInfo from '../components/RequestInfo'
import constructStepData from '../utils/ConstructStepData'
import { textVariant } from '../utils/motion'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../css/RequestDetail.scss'
import { addNotification, getRecommendServices, getRequestById } from '../utils/FirebaseAPI'
import { updateRequestById, updateServiceRemainById } from '../utils/FirebaseAPI'
import ParticlesBg from '../components/ParticlesBg'
import { useNavigate } from 'react-router-dom'

const RequestDetail = () => {
  const Statusline = ({ params, step }) => {
    const navigate = useNavigate()
    const changeStatus = async selection => {
      console.log('change status', params, params.id)
      if (selection === 'accept') {
        await updateRequestById(params.id, { status: 'accepted' })
      } else if (selection === 'reject') {
        await updateServiceRemainById(request.srv_id)
        await updateRequestById(params.id, { status: 'rejected' })
      } else if (selection === 'detail') {
        const notifyData = {
          msg_id: 'tobe generated',
          msg_type: 'needDetail',
          user_id: 'All',
          user_name: '',
          srv_id: request.srv_id,
          srv_name: request.srv_name,
          prv_name: request.prv_name,
          msg_title: 'Need more detail',
          msg_body: 'Please provide more detail',
          time: Date.now(),
          isRead: false,
          needDetail: {
            req_id: request.req_id,
            req_time: request.req_time,
          },
          jumpLink: '/' + request.srv_id,
        }
        addNotification(notifyData).then(res => {
          console.log(res)
        })

        await updateRequestById(params.id, { status: 'needDetail' })
      } else if (selection === 'completed') {
        const notifyData = {
          msg_id: 'tobe generated',
          msg_type: 'review',
          user_id: 'All',
          user_name: '',
          srv_id: request.srv_id,
          srv_name: request.srv_name,
          prv_name: request.prv_name,
          msg_title: `Your request has been successfully completed, let's write a review!`,
          msg_body: `Experienced great service? Come and write your review!`,
          time: Date.now(),
          isRead: false,
          needDetail: {
            req_id: request.req_id,
            req_time: request.req_time,
          },
          jumpLink: '/' + request.srv_id,
        }
        addNotification(notifyData).then(res => {
          console.log(res)
        })
        await updateServiceRemainById(request.srv_id)
        await updateRequestById(params.id, { status: 'completed' })
      }
      getRequestById(params.id).then(res => {
        const data = res.data()
        console.log('in reqeust detail getrequestbyid', data)
        console.log(data)
        setRequest(data)
        setSteps(constructStepData(data.status))
        // console.log(constructStepData('pending')[0].description)
      })
    }

    return (
      <VerticalTimelineElement
        contentStyle={{
          background: '#1d1836',
          color: '#fff',
        }}
        contentArrowStyle={{ borderRight: '7px solid  #232631' }}
        // date={status.date}
        iconStyle={{ backgroundColor: '#1d1836', color: '#fff' }}
        icon={<CheckCircleTwoTone twoToneColor='#52c41a' style={{ width: '100%', height: '100%' }} />}>
        <div>
          <h3 className='text-xl font-bold'>{step.title}</h3>
          <h4> {step.description}</h4>
        </div>
        {step.title === 'Pending' && step.cur && (
          <div>
            <Button onClick={() => changeStatus('accept')}>Accept</Button>
            <Button onClick={() => changeStatus('reject')}>Reject</Button>
            <Button onClick={() => changeStatus('detail')}>Need more detail</Button>
          </div>
        )}
        {step.title === 'Working' && (
          <div>
            <Button onClick={() => changeStatus('completed')}>Work Done!</Button>
          </div>
        )}
      </VerticalTimelineElement>
    )
  }
  const [request, setRequest] = useState(null)
  const [steps, setSteps] = useState(constructStepData('pending'))
  const params = useParams()
  // console.log('in request detail', params, params.id)
  useEffect(() => {
    getRequestById(params.id).then(res => {
      const data = res.data()
      console.log('in reqeust detail getrequestbyid', data)
      console.log(data)
      setRequest(data)
      setSteps(constructStepData(data.status))
      // console.log(constructStepData('pending')[0].description)
    })
  }, [])
  return (
    <div className='requestdetail-container'>
      {/* <ParticlesBg /> */}
      <Row className='requestdetail-card-container'>
        <Col span={8}>
          <RequestInfo className='requestdetail-card' data={request} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div>
            <VerticalTimeline>
              {steps.map((s, index) => (
                <Statusline key={`status-${index}`} params={params} step={s} />
              ))}
            </VerticalTimeline>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default RequestDetail
