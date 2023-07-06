import { Col, List, Row, Avatar, Space, Rate, Modal, Input, Button } from 'antd'
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons'
const { TextArea } = Input
// import '../css/ServiceReview.scss'
import React, { useEffect, useRef, useState } from 'react'
import { timestamp2DateStr } from '../utils/TimeParser'
import '../css/ServiceReview.scss'
import {
  addRequestDetails,
  addReview,
  getNotifications,
  setNotificationStatus,
  withDrawRequest,
} from '../utils/FirebaseAPI'
import { useNavigate } from 'react-router-dom'

function MyList({ data }) {
  const navigate = useNavigate()
  // review modal
  const reviewBoxRef = useRef(null)
  const [isRvwModalOpen, setIsRvwModalOpen] = useState(false)
  const [reviewTxt, setReviewTxt] = useState(null)
  const [rateValue, setRateValue] = useState(null)
  const [reviewHead, setReviewHead] = useState(null)

  // add detail modal
  const detailBoxRef = useRef(null)
  const withdrawRef = useRef(null)
  const [isAddModallOpen, setIsAddModalOpen] = useState(false)
  const [detailTxt, setDetailTxt] = useState(null)

  const [currMsgId, setCurrMsgId] = useState(null)
  const [currDataItem, setCurrDataItem] = useState(null)

  const { user_name, user_id, srv_id } = data[0]

  const handleItemClick = (event, itemData) => {
    console.log('List item clicked: ', event.target)
    console.log('Item data: ', itemData)

    // type=review, then write review in popup
    if (itemData.msg_type == 'review') {
      setCurrMsgId(itemData.msg_id)
      showReviewModal()
    } else if (itemData.msg_type == 'needDetail') {
      //TODO:
      setCurrMsgId(itemData.msg_id)
      setCurrDataItem(itemData)
      showAddDetailModal()
    } else {
      // type=update, then redirect to updated service page
      navigate(itemData.jumpLink)
      // HINT: change isRead into true
      setNotificationStatus(itemData.msg_id)
    }
  }

  // START: Modal ctrls - writing review
  const showReviewModal = () => {
    setIsRvwModalOpen(true)
  }
  const handleRvwModalOk = () => {
    // setIsRvwModalOpen(false)
    // TODO: publish review( add review into db)
    const rvwData = {
      rvw_id: null, // auto gen by firebase
      srv_id: srv_id,
      author: {
        user_id: user_id,
        user_name: user_name,
        user_avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=1`, // TODO: make it random
      },
      title: reviewHead,
      content: reviewTxt,
      rate: rateValue,
      likes: 0,
      date: Date.now(),
    }

    console.log('rwvData: ', rvwData)

    addReview(rvwData).then(_ => {
      console.log('Review added: ', _)
      setRateValue(0)
      setReviewTxt(null)
      setReviewHead(null)
      setIsRvwModalOpen(false)

      setNotificationStatus(currMsgId).then(_ => {
        setCurrMsgId(null)
        window.location.reload()
      })
    })
  }
  const handleRvwModalCancel = () => {
    setRateValue(0)
    setReviewTxt(null)
    setReviewHead(null)
    setIsRvwModalOpen(false)
  }

  const handleRvwHeadChange = e => {
    const value = e.target.value
    setReviewHead(value)
  }

  const onRvwTextChange = e => {
    const value = e.target.value
    setReviewTxt(value)
  }

  const handleRvwRateChange = value => {
    console.log('Rate value: ', value)
    setRateValue(value)
  }
  //END: Modal ctrls - writing review

  // START: Modal ctrls - add details
  const showAddDetailModal = () => {
    setIsAddModalOpen(true)
  }

  const handleAddModalOk = () => {
    console.log('Add detail successfully: ', detailTxt)
    console.log('currDataItem: ', currDataItem)

    const { req_id } = currDataItem.needDetail
    // console.log('req_id: ', req_id)
    addRequestDetails(req_id, detailTxt).then(_ => {
      console.log('Successfully added details!')
      setDetailTxt(null)
      setIsAddModalOpen(false)

      setNotificationStatus(currMsgId).then(_ => {
        setCurrMsgId(null)
        setCurrDataItem(null)
        window.location.reload()
      })
    })
  }

  const handleAddModalCancel = () => {
    setDetailTxt(null)
    setCurrMsgId(null)
    setCurrDataItem(null)
    setIsAddModalOpen(false)
  }

  const handleWithdraw = () => {
    console.log(currDataItem)
    const { req_id } = currDataItem.needDetail
    withDrawRequest(req_id).then(_ => {
      console.log('Successfully withdrawn!')
      setDetailTxt(null)
      setIsAddModalOpen(false)

      setNotificationStatus(currMsgId).then(_ => {
        setCurrMsgId(null)
        setCurrDataItem(null)
        window.location.reload()
      })
    })
  }

  const onDetailTxtChange = e => {
    setDetailTxt(e.target.value)
  }

  // END: Modal ctrls - add details

  return (
    <>
      {/* Write review Modal */}
      <Modal
        title='✍️ Write your review here'
        open={isRvwModalOpen}
        onOk={handleRvwModalOk}
        onCancel={handleRvwModalCancel}>
        <h3 style={{ marginTop: 10, marginBottom: 10 }}>Review Title:</h3>
        <Input placeholder='Your Review Title' value={reviewHead} onChange={handleRvwHeadChange} />
        <h3 style={{ marginTop: 10, marginBottom: 10 }}>Review Content:</h3>
        <TextArea
          // showCount
          // maxLength={100}
          value={reviewTxt}
          ref={reviewBoxRef}
          style={{
            height: 100,
            resize: 'none',
          }}
          onChange={onRvwTextChange}
          placeholder='Had great service? Give your valuable comments!'
        />
        <h3 style={{ marginTop: 10, marginBottom: 10 }}>Rate:</h3>
        <Rate allowHalf value={rateValue} onChange={handleRvwRateChange} />
      </Modal>

      {/* Add detail Modal */}
      <Modal
        title='✍️ Please provide more details for your request'
        open={isAddModallOpen}
        onOk={handleAddModalOk}
        onCancel={handleAddModalCancel}>
        <h3 style={{ marginTop: 10, marginBottom: 10 }}>Add details:</h3>
        <TextArea
          // showCount
          // maxLength={100}
          value={detailTxt}
          ref={detailBoxRef}
          style={{
            height: 100,
            resize: 'none',
          }}
          onChange={onDetailTxtChange}
          placeholder='Your service provider need more details from you...'
        />
        <h3 style={{ marginTop: 10, marginBottom: 10 }}>Or wanna withdraw this request?</h3>
        <Button ref={withdrawRef} onClick={handleWithdraw}>
          {' '}
          Withdraw{' '}
        </Button>
      </Modal>
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
          <div style={{ color: 'black' }}>
            {/* TODO: add list footer */}
            <b>@ Find-A-Service</b> Team G15
          </div>
        }
        renderItem={item => (
          <List.Item
            // onClick={handleItemClick} // HINT: 通过匿名函数传递参数
            onClick={event => {
              handleItemClick(event, item)
            }}
            style={{
              borderColor: '#3a0071',
              borderWidth: 2,
              backgroundColor: 'white',
              borderRadius: 20,
              marginBottom: 5,
            }}
            className='review-list-item'
            key={item.title}
            actions={[
              <div className='review-date' style={{ color: 'black' }}>
                {timestamp2DateStr(item.time)}
              </div>,
            ]}
            extra={''}>
            <List.Item.Meta
              // avatar={<Avatar src={item.author.user_avatar} />}
              title={<span style={{ color: 'black' }}>{item.msg_title}</span>}
              description={
                <div className='rate-area' style={{ color: 'black' }}>
                  {'@' + item.prv_name}
                </div>
              }
            />
            {<span style={{ color: 'black' }}>{item.msg_body}</span>}
          </List.Item>
        )}
      />
    </>
  )
}

export default function CustomerNotification() {
  const [data, setData] = useState(null)

  // const user_id = 'xRv9DqSlQRcK7Mpd2Z98wCLYmPs1' // TODO: use localstorage [done]
  const user_id = localStorage.getItem('loginID')

  // fetch notification data
  let ignore = false
  useEffect(() => {
    if (!ignore) {
      const getData = async () => {
        const notiData = await getNotifications(user_id)
        // NOTE: only notify those unread messages
        const unreadNotiData = []
        notiData.forEach(item => {
          if (!item.isRead) {
            unreadNotiData.push(item)
          }
        })
        console.log('Notification data: ', notiData)
        console.log('Unread data: ', unreadNotiData)
        setData(unreadNotiData)
      }

      getData()
    }

    return () => {
      ignore = true
    }
  }, [])

  // refresh
  useEffect(() => {
    const k = 10 * 1000 // 10s refresh
    const refresher = setInterval(() => {
      // console.log(Date.now())
      console.log('Notification refreshing...')
      // window.location.reload()
      // forceUpdate()

      const getData = async () => {
        const notiData = await getNotifications(user_id)
        // NOTE: only notify those unread messages
        const unreadNotiData = []
        notiData.forEach(item => {
          if (!item.isRead) {
            unreadNotiData.push(item)
          }
        })
        console.log('Notification data: ', notiData)
        console.log('Unread data: ', unreadNotiData)
        setData(unreadNotiData)
      }

      getData()
    }, k)

    return () => {
      clearInterval(refresher)
    }
  }, [])

  return (
    <Row className='notification-list' justify='start'>
      <Col span={24}>{data && data.length != 0 ? <MyList data={data} /> : 'You have no messages!'}</Col>
    </Row>
  )
}
