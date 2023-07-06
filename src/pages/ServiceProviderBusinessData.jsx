import { Carousel, Row, Col, Rate, Divider } from 'antd'
import react, { useState, useEffect } from 'react'
import { getLoginUserId } from '../utils/LoginInfo'
import {
  getServiceProviderById,
  getRequestCountByProviderId,
  getStatusRequestCountByProviderId,
  getServiceCountByProviderId,
} from '../utils/FirebaseAPI'
import '../css/ServiceProviderBusinessData.scss'
import { PieChart } from 'react-minimal-pie-chart'
const ServiceProviderBusinessData = () => {
  const loginUserId = getLoginUserId()
  const [user, setUser] = useState({})
  const [requestCount, setRequestCount] = useState(0)
  const [statusRequestCount, setStatusRequestCount] = useState([30, 30, 30])
  const [serviceCount, setServiceCount] = useState(0)
  const dataEntry = [
    { title: 'Pending', value: statusRequestCount[0], color: '#E38627' },
    { title: 'Working', value: statusRequestCount[1], color: '#C13C37' },
    { title: 'Completed', value: statusRequestCount[2], color: '#6A2135' },
  ]
  useEffect(() => {
    getServiceProviderById(loginUserId).then(res => {
      setUser(res)
    })
    getRequestCountByProviderId(loginUserId).then(res => {
      setRequestCount(res)
    })
    getServiceCountByProviderId(loginUserId).then(res => {
      setServiceCount(res)
    })
    getStatusRequestCountByProviderId(loginUserId).then(res => {
      setStatusRequestCount(res)
    })
  }, [])

  return (
    <div className='data-page'>
      <Row justify={'space-around'}>
        <Col span={8}>
          <div className='service-data'>
            <Carousel autoplay>
              {user?.imgs?.map((item, index) => {
                return (
                  <img
                    style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                    key={'img ' + 'index'}
                    src={item}
                    alt='img'
                  />
                )
              })}
            </Carousel>
          </div>
        </Col>
        <Col span={8}>
          <div className='service-data'>
            <h3 className='line-h3'>My services</h3>
            <Divider style={{ backgroundColor: 'white' }} />
            <h3 className='line-h3'>Total:</h3>
            <h3 className='line-h3' style={{ color: '#9ba3c0' }}>
              {serviceCount}
            </h3>
            {/* <h3 className='line-h3'>Average rating:</h3>
            <Rate disable allowHalf value={5} /> */}
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className='request-data'>
            <h3>My requests</h3>
            <Divider key='2d' style={{ backgroundColor: 'white' }} />
            <Row>
              <Col span={12}>
                <div className='request-numeric-data'>
                  <h3 className='line-h3'>Total:</h3>
                  <h3 className='line-h3'>{requestCount}</h3>
                  <Divider style={{ 'background-color': 'white' }} />
                  <h3 className='line-h3'>
                    Pending: <span style={{ color: '#9ba3c0' }}>{statusRequestCount[0]}</span>
                  </h3>

                  <h3 className='line-h3'>
                    Working: <span style={{ color: '#9ba3c0' }}>{statusRequestCount[1]}</span>
                  </h3>

                  <h3 className='line-h3'>
                    Completed: <span style={{ color: '#9ba3c0' }}>{statusRequestCount[2]}</span>
                  </h3>
                </div>
              </Col>
              <Col span={12}>
                <div className='request-pie-data'>
                  <PieChart
                    labelPosition={80}
                    labelStyle={{
                      fontSize: '15px',
                      fontFamily: 'sans-serif',
                      fill: '#ffffff',
                    }}
                    animate={true}
                    style={{ height: '200px' }}
                    totalValue={requestCount}
                    lineWidth={70}
                    data={dataEntry}
                    label={({ dataEntry }) => {
                      if (dataEntry.value) return dataEntry.title
                      else return ''
                    }}
                  />
                  ;
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default ServiceProviderBusinessData
