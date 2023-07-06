import React, { useState } from 'react'
import { Layout, Menu, Avatar, Button } from 'antd'
import { Outlet, useLocation, Link } from 'react-router-dom'
import '../css/ServiceProviderIndex.scss'
import { useEffect } from 'react'
import ParticlesBg from '../components/ParticlesBg'
const { Header, Content, Sider } = Layout
import { getLoginUserId } from '../utils/LoginInfo'
import { getServiceProviderById } from '../utils/FirebaseAPI'
import ManageAccount from './ManageAccount'
const ServiceProviderIndex = () => {
  const [loading, setLoading] = useState(true)
  const loginId = getLoginUserId()
  const [canLogin, setCanLogin] = useState(true)
  const [update, setUpdate] = useState(false)
  const [name, setName] = useState('')
  const [avatarSrc, setAvatarSrc] = useState('')
  const [selectedMenuItem, setSelectedMenuItem] = useState('overview')
  const location = useLocation().pathname.split('/')[2]
  useEffect(() => {
    console.log('im', loginId)
    console.log('wtf', loginId)
    getServiceProviderById(loginId).then(res => {
      console.log(res)
      if (res === undefined) {
        setCanLogin(false)
      } else {
        setName(res.prv_name)
        setAvatarSrc(res.avatar)
        setCanLogin(res.approved)
        setUpdate(res.needupdate)
      }
    })
    if (location === 'manage-service' || location === 'add-service') {
      setSelectedMenuItem('service')
    } else if (location === 'manage-request') {
      setSelectedMenuItem('request')
    } else if (location === 'manage-account') {
      setSelectedMenuItem('account')
    } else {
      setSelectedMenuItem('overview')
    }
    setLoading(false)
  }, [])
  // console.log(location)
  const handleMenuItemClick = e => {
    setSelectedMenuItem(e.key)
  }

  console.log('check loading: ', loading)

  if (loading) return <div>loading</div>

  if (!canLogin) {
    if (update)
      return (
        <>
          <ParticlesBg />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              // alignItems: 'center',
              width: '100%',
              height: '100vh',
              border: 0,
              backgroundColor: '#050816',
            }}>
            <h1
              style={{
                fontSize: '2.5rem',
                marginTop: '20px',
                margin: 'auto',
                // textAlign: 'center',
                color: 'white',
              }}>
              {' '}
              Please update your info{' '}
            </h1>
            <Button
              style={{ margin: 'auto', marginTop: '20px', marginBottom: '-20px' }}
              type='primary'
              onClick={() => window.history.back()}>
              Done!
            </Button>
            <ManageAccount />
          </div>
        </>
      )
    else
      return (
        <>
          <ParticlesBg />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              width: '100%',
              height: '100vh',
              backgroundColor: '#050816',
            }}>
            <h1 style={{ color: 'white' }}>Your account is not approved or you are banned.</h1>)
            <Button onClick={() => window.history.back()}>Back</Button>
          </div>
        </>
      )
  }

  return (
    <div className='service-provider-container'>
      <Layout className='navigation'>
        <Sider theme='dark'>
          <Menu
            theme='dark'
            mode='inline'
            selectedKeys={[selectedMenuItem]}
            onClick={handleMenuItemClick}
            className='index-menu'>
            <Menu.Item key='avatar'>
              <div className='info'>
                <Avatar
                  style={{ zIndex: 15 }}
                  size={64}
                  src={avatarSrc}
                  onClick={() => {
                    console.log('click', avatarSrc)
                  }}
                />
                <span> {name} </span>
              </div>
            </Menu.Item>

            <Menu.Item key='overview'>
              <Link to='/service-provider/business-data'>My Info</Link>
            </Menu.Item>
            <Menu.Item key='account'>
              <Link to='/service-provider/manage-account'>Account</Link>
            </Menu.Item>
            <Menu.Item key='service'>
              <Link to='/service-provider/manage-service'>Service</Link>
            </Menu.Item>
            <Menu.Item key='request'>
              <Link to='/service-provider/manage-request'>Request</Link>
            </Menu.Item>
            <Menu.Item key='logout'>
              <Link
                to='/login'
                onClick={() => {
                  localStorage.removeItem('loginID')
                  localStorage.removeItem(loginId)
                }}>
                Log out
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content className='index-content'>
            <ParticlesBg />
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default ServiceProviderIndex
