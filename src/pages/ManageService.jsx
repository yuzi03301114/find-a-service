import { Avatar, Button, List, Skeleton, Image, Row, Col } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import {
  deleteService,
  getServicesByServiceProvider,
  getServicesByServiceProviderId,
  getAllServices,
  addFakeRequest,
} from '../utils/FirebaseAPI'
import openNotification from '../components/Notification'
import { addFakeData } from '../utils/FirebaseAPI'
import { getLoginUserId } from '../utils/LoginInfo'
import '../css/ManageService.scss'

const ManageService = () => {
  const [loginUserId, setLoginUserId] = useState(getLoginUserId())
  const [services, setServices] = useState([])
  const cardRWDController = () => {
    const viewportW = window.innerWidth
    console.log(viewportW)
    console.log(services)
    if (viewportW > 1200) {
      setPagesize(8)
      setPageCol(4)
    } else if (viewportW > 1000 && viewportW < 1200) {
      setPagesize(6)
      setPageCol(3)
    } else if (viewportW > 700 && viewportW < 1000) {
      setPagesize(4)
      setPageCol(2)
    } else {
      setPagesize(1)
      setPageCol(1)
    }
  }
  window.onresize = () => {
    cardRWDController()
  }
  // pagesize change with viewport
  const [pagesize, setPagesize] = useState(10)
  const [pageCol, setPageCol] = useState(5)
  useEffect(() => {
    // addFakeData(5)
    //后期要从登录状态换取当前登录的provider
    cardRWDController()
    getServicesByServiceProviderId(loginUserId).then(data => {
      // console.log(data)
      setServices(data)
      console.log(data)
    })
  }, [])

  return (
    <div className='provider-cards-area'>
      <div className='provider-card-list-container'>
        {services ? (
          <List
            pagination={{
              onChange: page => {
                console.log(page)
              },
              pageSize: pagesize,
              position: 'bottom',
              align: 'center',
              itemRender: (current, type, originalElement) => {
                if (type === 'prev') {
                  return (
                    <div>
                      <span>
                        <Button href='/service-provider/add-service'>Add</Button>
                      </span>
                      {originalElement}
                    </div>
                  )
                }
                if (type === 'next') {
                  return originalElement
                }
                if (type === 'page') {
                  return originalElement
                }
                return originalElement
              },
            }}
            grid={{
              gutter: 20,
              column: pageCol,
            }}
            dataSource={services}
            renderItem={(item, index) => (
              <List.Item>
                <Link to={'/service-provider/edit-service/' + item.srv_id}>
                  <Card key={`card-${index}`} data={item} />
                </Link>
              </List.Item>
            )}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  )
}
export default ManageService
