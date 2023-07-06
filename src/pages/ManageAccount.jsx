import React from 'react'
import { Button, Avatar, Form, Input, Row, Col } from 'antd'
import openNotification from '../components/Notification'
import { addServiceProvider } from '../utils/FirebaseAPI'
import { useEffect, useRef, useState } from 'react'
import { getServiceProviderById, updateServiceProviderById } from '../utils/FirebaseAPI'
import { getLoginUserId } from '../utils/LoginInfo'
import '../css/ManageAccount.scss'

const Label = ({ text }) => (
  <span
    style={{
      color: 'white',
      fontWeight: 'bold',
      fontSize: '20px',
    }}>
    {text}
  </span>
)

const ManageAccount = () => {
  const loginUserId = getLoginUserId()
  const [avatarSrc, setAvatarSrc] = useState('')
  const formRef = useRef(null)
  const onFinish = values => {
    const docRef = updateServiceProviderById(loginUserId, values)
    if (docRef) {
      console.log('Success:', values)
      openNotification('Notification', 'Change saved!')
    } else {
      console.log('Failed:', values)
      openNotification('Notification', 'Failed')
    }
  }
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  useEffect(() => {
    getServiceProviderById(loginUserId).then(doc => {
      console.log('get login user info', doc)
      formRef.current.setFieldsValue({
        prv_name: doc.prv_name,
        password: doc.password,
        description: doc.description,
        Address: doc.location.txt,
        Email: doc.email,
      })
      console.log(doc.avatar[0])
      setAvatarSrc(doc.avatar)
    })
  }, [])

  console.log('get login user info', loginUserId)
  return (
    <div className='account-container'>
      <Form
        className='account-form'
        ref={formRef}
        name='basic'
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 14,
        }}
        style={{
          maxWidth: 600,
          color: 'white',
          textWeight: 'bold',
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Row className='center-row'>
          <Avatar src={avatarSrc} size={148} />
        </Row>

        <Form.Item
          label={Label({ text: 'Name' })}
          name='prv_name'
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}>
          <Input className='account-input' />
        </Form.Item>

        <Form.Item
          label={Label({ text: 'Password' })}
          name='password'
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}>
          <Input.Password />
        </Form.Item>

        <Form.Item label={Label({ text: 'Description' })} name='description'>
          <Input className='account-input' />
        </Form.Item>

        <Form.Item
          label={Label({ text: 'Address' })}
          name='Address'
          rules={[
            {
              required: true,
              message: 'Please input your address!',
            },
          ]}>
          <Input className='account-input' />
        </Form.Item>
        <Form.Item
          label={Label({ text: 'Email' })}
          name='Email'
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}>
          <Input className='account-input' />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}>
          <Button type='primary' htmlType='submit' style={{ marginLeft: '4em' }}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
export default ManageAccount
