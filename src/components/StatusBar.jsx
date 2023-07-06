import { Avatar, Col, Drawer, Row } from 'antd'
import '../css/StatusBar.scss'
import { UserOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'
import { decrypt } from '../utils/RGEncrypt'
import { useNavigate } from 'react-router-dom'

export default function StatusBar() {
  // const [, forceUpdate] = useState()
  const navigate = useNavigate()
  const loginID = localStorage.getItem('loginID')
  let userInfo = localStorage.getItem(loginID)
  // console.log(loginID)

  const user_id = useRef(null)

  if (loginID) {
    user_id.current = loginID
    userInfo = JSON.parse(decrypt(userInfo))
    // console.log(userInfo)
  }

  const [open, setOpen] = useState(false)

  const showDrawer = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }

  return (
    <div className='status-bar'>
      <Row className='nav-bar'>
        <Col span={4} className='logo'>
          <a href='/'>Find A Service</a>
        </Col>
        <Col span={2} className='home'>
          <a href='/'>Home</a>
        </Col>
        <Col span={16} className='slogan'>
          Find the best service only for you!
        </Col>
        <Col span={2} className='user-avatar'>
          {loginID ? (
            <Avatar
              icon={<UserOutlined />}
              style={{
                // backgroundColor: '#87d068',
                borderColor: 'aliceblue',
              }}
              onClick={() => {
                showDrawer()
                console.log('avatar clicked!')
              }}
            />
          ) : (
            <a className='login-btn' href='/login'>
              Login
            </a>
          )}
        </Col>
      </Row>
      <Drawer
        title={userInfo ? userInfo.email : ''}
        placement='right'
        onClose={onClose}
        open={open}
        width={350}
        style={{
          opacity: 0.7,
        }}>
        <div className='link-box'>
          <a href={`/mypage/${loginID}/profile`} className='profile'>
            🦊 My Profile
          </a>
        </div>
        <div className='link-box'>
          <a href={`/mypage/${loginID}/requests`} className='request-log'>
            🛒 My Requests
          </a>
        </div>
        <div className='link-box'>
          <a href={`/mypage/${loginID}/notifications`} className='request-log'>
            📧 My Notifications
          </a>
        </div>
        <div className='link-box logout'>
          <a
            onClick={() => {
              // localStorage.setItem('loginID', false)
              localStorage.removeItem('loginID')
              localStorage.removeItem(user_id.current)
              const currentURL = window.location.pathname
              if (currentURL.split('/')[1] == 'mypage') {
                navigate('/')
              } else {
                setOpen(false)
              }
              // forceUpdate()
            }}>
            💫 Log out
          </a>
        </div>
      </Drawer>
    </div>
  )
}
