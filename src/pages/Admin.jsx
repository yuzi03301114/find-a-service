import React from 'react'
import { auth } from '../utils/FirebaseSetup'
import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import {
  addFakeData,
  getServiceProviderByApproved,
  deleteServiceProviderById,
  deleteReviewById,
  getReviewById,
  addFakeReview,
  updateServiceProviderById,
  getServiceProviderById,
  getAllReviews,
} from '../utils/FirebaseAPI'
import ParticlesBg from '../components/ParticlesBg'
import { Row, Col, List, Skeleton, Avatar, Input, Image, Modal, Rate, Button } from 'antd'
const { TextArea } = Input
import { Link } from 'react-router-dom'
import '../css/Admin.scss'
import { timestamp2DateStr } from '../utils/TimeParser'
const Admin = () => {
  const [viewData, setViewData] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeProviders, setActiveProviders] = useState([])
  const [inactiveProviders, setInactiveProviders] = useState([])
  const [reviews, setReviews] = useState([])
  const [review, setReview] = useState({})
  const showProvider = id => {
    console.log('show modal', id)
    getServiceProviderById(id).then(res => {
      console.log('success get', id, res)
      setViewData(res)
    })
    setIsModalOpen(true)
  }

  const handleOk = id => {
    console.log('handle ok', id)
    setIsModalOpen(false)
  }

  const handleCancel = id => {
    console.log('handle cancel', id)
    updateServiceProviderById(id, { needupdate: true }).then(res => {
      console.log('success updated', id, res)
    })
    setIsModalOpen(false)
  }

  const handleReviewOk = id => {
    console.log('handle Review ok', id)
    setIsReviewModalOpen(false)
  }

  const handleReviewCancel = id => {
    console.log('handle Review cancel', id)
    deleteReviewById(id).then(res => {
      console.log('success deleted review', id, res)
    })
    setIsReviewModalOpen(false)
  }

  const deleteProvider = id => {
    deleteServiceProviderById(id)
      .then(res => {
        console.log('success deleted', id, res)
      })
      .then(
        getServiceProviderByApproved(false).then(res => {
          setInactiveProviders(res)
        }),
        getServiceProviderByApproved(true).then(res => {
          setActiveProviders(res)
        })
      )
  }

  const showReview = id => {
    console.log('show review modal', id)
    getReviewById(id).then(res => {
      console.log('success get review', id, res)
      setReview(res[0])
    })
    setIsReviewModalOpen(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('loginID')
    window.location.href = '/login'
  }
  const deleteReview = id => {
    deleteReviewById(id)
      .then(res => {
        console.log('success deleted review', id, res)
      })
      .then(
        getAllReviews().then(res => {
          setReviews(res)
        })
      )
  }

  const approveProvider = id => {
    updateServiceProviderById(id, { approved: true })
      .then(res => {
        console.log('success updated', id, res)
      })
      .then(res => {
        getServiceProviderByApproved(false).then(res => {
          setInactiveProviders(res)
        })
        getServiceProviderByApproved(true).then(res => {
          setActiveProviders(res)
        })
      })
  }

  useEffect(() => {
    // addFakeReview(3)
    // getAuth()
    //   .deleteUser('4yOGtiPW5XgOreN0K8cEWw17T3I2')
    //   .then(res => {
    //     console.log('success deleted', res)
    //   })
    setLoading(true)
    getServiceProviderByApproved(true).then(res => {
      setActiveProviders(res)
    })
    getServiceProviderByApproved(false).then(res => {
      setInactiveProviders(res)
    })
    getAllReviews().then(res => {
      setReviews(res)
    })

    setLoading(false)
  }, [])
  return (
    <div className='admin-page'>
      <ParticlesBg />
      <h1 className='admin-title'>Admin Panel</h1>
      <div>
        <Row>
          <Col span={8}>
            <div className='list-container'>
              <h2 className='list-title'> Approved Providers</h2>
              <List
                className='demo-loadmore-list'
                // loading={initLoading}
                itemLayout='horizontal'
                // loadMore={loadMore}
                dataSource={activeProviders}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <a key={item.prv_id} onClick={() => showProvider(item.prv_id)}>
                        view
                      </a>,
                      <a key={item.prv_id} onClick={() => deleteProvider(item.prv_id)}>
                        remove
                      </a>,
                    ]}>
                    <Skeleton avatar title={false} loading={loading} active>
                      <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={<a href='https://ant.design'>{item.prv_name}</a>}
                        description={item.description}
                      />
                      {/* <div>content</div> */}
                    </Skeleton>
                  </List.Item>
                )}
              />
            </div>
          </Col>
          <Col span={8}>
            <div className='list-container'>
              <h2 className='list-title'> Pending Providers</h2>
              <List
                className='demo-loadmore-list'
                // loading={initLoading}
                itemLayout='horizontal'
                // loadMore={loadMore}
                dataSource={inactiveProviders}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <a key={item.prv_id} onClick={() => showProvider(item.prv_id)}>
                        view
                      </a>,
                      <a key={item.prv_id} onClick={() => approveProvider(item.prv_id)}>
                        approve
                      </a>,
                      <a key={item.prv_id} onClick={() => deleteProvider(item.prv_id)}>
                        reject
                      </a>,
                    ]}>
                    <Skeleton avatar title={false} loading={loading} active>
                      <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={<a href='https://ant.design'>{item.prv_name}</a>}
                        description={item.description}
                      />
                      {/* <div>content</div> */}
                    </Skeleton>
                  </List.Item>
                )}
              />
            </div>
          </Col>
          <Col span={8}>
            <div className='list-container'>
              <h2 className='list-title'> Reviews</h2>
              <List
                className='demo-loadmore-list'
                // loading={initLoading}
                itemLayout='horizontal'
                // loadMore={loadMore}
                dataSource={reviews}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <a key={item.rvw_id} onClick={() => showReview(item.rvw_id)}>
                        view
                      </a>,
                      ,
                      <a key={item.rvw_id} onClick={() => deleteReview(item.rvw_id)}>
                        delete
                      </a>,
                    ]}>
                    <Skeleton avatar title={false} loading={loading} active>
                      <List.Item.Meta
                        avatar={<Avatar src={item.author.user_avatar} />}
                        title={<a href='https://ant.design'>{item.author.user_name}</a>}
                        description={item.title}
                      />
                      <Rate allowHalf disabled value={item.rate} />
                    </Skeleton>
                  </List.Item>
                )}
              />
            </div>
          </Col>
        </Row>
      </div>
      <div className='admin-footer'>
        <Button className='admin-logout-button' onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <Modal
        title={'Info of ' + viewData.prv_id}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => handleCancel(viewData.prv_id)}
        cancelText='Need more info'>
        <div className='account-container'>
          <Row className='center-row'>
            <Avatar src={viewData && viewData.avatar} size={64} />
          </Row>

          <Row className='info-row'>
            <Col span={12}>Name :</Col>
            <Col span={12}>
              <Input style={{ width: '10em' }} value={viewData && viewData.prv_name} />
            </Col>
          </Row>

          <Row className='info-row'>
            <Col span={12}>Password:</Col>
            <Col span={12}>
              <Input style={{ width: '10em' }} value={viewData && viewData.password} />
            </Col>
          </Row>

          <Row className='info-row'>
            <Col span={12}>Description:</Col>
            <Col span={12}>
              <Input style={{ width: '10em' }} value={viewData && viewData.description} />
            </Col>
          </Row>

          <Row className='info-row'>
            <Col span={12}>Address:</Col>
            <Col span={12}>
              <Input style={{ width: '10em' }} value={viewData && viewData.location && viewData.location.txt} />
            </Col>
          </Row>
          {viewData &&
            viewData.imgs &&
            viewData.imgs.map((img, index) => {
              return (
                <Row key={index}>
                  <Image src={img} />
                </Row>
              )
            })}
        </div>
      </Modal>
      <Modal title='✍️ Review detail' open={isReviewModalOpen} onOk={handleReviewOk} onCancel={handleReviewCancel}>
        <h3 style={{ marginTop: 10, marginBottom: 10 }}>Review Title:</h3>
        <Input placeholder='Your Review Title' value={review.title} />
        <h3 style={{ marginTop: 10, marginBottom: 10 }}>Review Content:</h3>
        <TextArea
          // showCount
          // maxLength={100}
          value={review.content}
          style={{
            height: 100,
            resize: 'none',
          }}
        />
        <h3 style={{ marginTop: 10, marginBottom: 10 }}>{timestamp2DateStr(review.date)}</h3>
        <h3 style={{ marginTop: 10, marginBottom: 10 }}>Rate:</h3>
        <Rate allowHalf value={review.rate} />
      </Modal>
    </div>
  )
}

export default Admin
