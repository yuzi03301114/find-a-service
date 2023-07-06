import React, { useState, useEffect } from 'react'
import { Row, Col } from 'antd'
import RequestCard from '../components/RequestCard'
import { getRequestsByServiceProviderId } from '../utils/FirebaseAPI'
import { addFakeRequest, getAllRequests } from '../utils/FirebaseAPI'
import { getLoginUserId } from '../utils/LoginInfo'
import { Link } from 'react-router-dom'
import '../css/ManageRequest.scss'
const ManageRequest = () => {
  const [requests, setRequests] = useState([])
  const [loginUserId, setLoginUserId] = useState(getLoginUserId())
  useEffect(() => {
    // addFakeRequest(5)
    //test
    getRequestsByServiceProviderId(loginUserId).then(data => {
      console.log('user id: ', loginUserId)
      console.log('getallrequesets', data)
      setRequests(data)
    })
  }, [])

  return (
    <div className='request-card-area'>
      <Row gutter={[16, 16]}>
        {requests.map((request, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            {/* onClick={() => handleCardClick(data)} */}
            {/* window.location.href = '/service-provider/request-detail/' + data.req_id */}
            <Link to={'/service-provider/request-detail/' + request.req_id}>
              <RequestCard data={request} />
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  )
}
export default ManageRequest
