import '../css/Login.scss'
import { Carousel, Col, Modal, Row } from 'antd'
import { Button, Form, Input, Radio } from 'antd'
import { useState } from 'react'
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { encrypt } from '../utils/RGEncrypt'
import { checkEmailFormat } from '../utils/FormatChecker'
// import { StyledFirebaseAuth } from 'react-firebaseui'
import { addCustomer } from '../utils/FirebaseAPI'

const redirectAfterLogin = (navigate, value) => {
  // NOTE: redirect after login
  const redirect = localStorage.getItem('redirect')
  // console.log(redirect)
  if (redirect) {
    localStorage.removeItem('redirect')
    navigate(redirect) // back to request after login
  } else {
    if (value === 1) navigate('/service-find')
    if (value === 2) navigate('/service-provider')
    if (value === 3) navigate('/admin')
  }
}

function LoginForm() {
  const navigate = useNavigate()
  const [radioValue, setRadioValue] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const auth = getAuth()

  // popup Modal controls
  // START
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  // END

  // TODO: 处理 user type
  const handleRadioChange = e => {
    console.log('radio checked', e.target.value)
    setRadioValue(e.target.value)
  }

  const onFinish = values => {
    console.log('Success:', values)
    const email = values.email
    const password = values.password

    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user
        //..
        console.log('Login successed: ', user)
        // TODO: 验证邮箱
        onAuthStateChanged(auth, user => {
          if (user) {
            console.log(user)
            console.log(encrypt(user))
            // HINT: 加密后再存储
            localStorage.setItem(user.uid, encrypt(user))
            localStorage.setItem('loginID', user.uid)
          } else {
            console.warn(user)
            localStorage.removeItem(user.uid)
          }
        })

        redirectAfterLogin(navigate, radioValue)
      })
      .catch(error => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log('Login failed: ', errorCode, errorMessage)
        showModal()
      })
  }
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const handleGoogleSignin = () => {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential.accessToken
        // The signed-in user info.
        const user = result.user

        localStorage.setItem(user.uid, encrypt(user))
        localStorage.setItem('loginID', user.uid)

        const userData = {
          user_id: user.uid,
          user_name: null,
          email: user.email,
          phone: null,
          location: {
            txt: null,
            gps: [null, null],
          },
          avatar: null,
        }

        // add user into Customer collection
        addCustomer(userData).then(res => console.log('Add done'))

        redirectAfterLogin(navigate, radioValue)

        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch(error => {
        // Handle Errors here.
        console.log(error)
        const errorCode = error.code
        const errorMessage = error.message
        // // The email of the user's account used.
        // const email = error.customData.email
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error)
        // ...
      })
  }

  return (
    <>
      <Row justify='center'>
        <Form
          name='basic'
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 16,
          }}
          // style={{
          //   maxWidth: 600,
          // }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'>
          {/* Email */}
          <Form.Item
            // label='Username'
            name='email'
            rules={[
              {
                required: true,
                message: 'Please input your email!!',
              },
              {
                pattern: checkEmailFormat(true),
                message: 'Invalid email format!',
              },
            ]}>
            <Input className='login-input' placeholder='email@mail.com' />
          </Form.Item>

          {/* Password */}
          <Form.Item
            // label='Password'
            name='password'
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}>
            <Input.Password className='login-input' placeholder='Password' />
          </Form.Item>

          {/* User type */}
          <Form.Item
            // label='User type'
            wrapperCol={{
              span: 24,
            }}>
            <Radio.Group onChange={handleRadioChange} value={radioValue}>
              <Radio value={1}>Customer</Radio>
              <Radio value={2}>Provider</Radio>
              <Radio value={3}>Admin</Radio>
            </Radio.Group>
          </Form.Item>

          {/* No Account Create */}
          <Form.Item>
            No Account?
            {/* TODO: 根据身份跳转不同登陆页面, href 通过 handleRadioChange 传值 */}
            <a className='create-one' href={radioValue == 1 ? '/customer-signup' : '/provider-signup'}>
              {' '}
              Create one!
            </a>
          </Form.Item>

          {/* Login btn */}
          <Form.Item
            wrapperCol={{
              // offset: 6,
              span: 24,
            }}>
            <Button className='login-btn' type='primary' htmlType='submit'>
              Login!
            </Button>
          </Form.Item>

          <Form.Item>
            <Button className='google-login' onClick={handleGoogleSignin}>
              Sign in with Google{' '}
            </Button>
          </Form.Item>
        </Form>
      </Row>

      {/* Popup Modal */}
      <Modal title='Note' style={{ top: 200 }} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        Incorrect account or password, please try again!
      </Modal>
    </>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [showImg, setShowImg] = useState(true)

  const auth = getAuth()

  const [formMarginL, setFormMarginL] = useState('0vw')

  const RWDContorller = () => {
    const viewportW = window.innerWidth
    if (viewportW < 1200 && viewportW > 1000) {
      setShowImg(false)
      setFormMarginL('20vw')
    } else if (viewportW < 1000 && viewportW > 800) {
      setShowImg(false)
      setFormMarginL('15vw')
    } else if (viewportW < 800 && viewportW > 600) {
      setShowImg(false)
      setFormMarginL('5vw')
    } else if (viewportW < 600) {
      setShowImg(false)
      setFormMarginL('0vw')
    } else {
      setShowImg(true)
      setFormMarginL('0vw')
    }
  }

  window.onload = () => {
    RWDContorller()
  }

  window.onresize = () => {
    RWDContorller()
  }

  return (
    <div className='login'>
      <Row align='middle' justify='center'>
        <>
          {showImg ? (
            <Col span={16}>
              <div className='img-box'>
                <Carousel autoplay>
                  <img
                    src='https://firebasestorage.googleapis.com/v0/b/find-a-service-818a4.appspot.com/o/images%2F1683882906054-C1-2.png?alt=media&token=78a75ead-c80f-48d7-b4af-6882d240f24d'
                    alt=''
                  />
                  <img
                    src='https://firebasestorage.googleapis.com/v0/b/find-a-service-818a4.appspot.com/o/images%2F1683883320703-C2-2.png?alt=media&token=0461842d-051a-4bac-8c65-3ffb3a41a083'
                    alt=''
                  />
                  <img
                    src='https://firebasestorage.googleapis.com/v0/b/find-a-service-818a4.appspot.com/o/images%2F1683884205157-E2-1.png?alt=media&token=fc53e6cd-df26-4f80-9a8f-f18bd6743068'
                    alt=''
                  />
                </Carousel>
              </div>
            </Col>
          ) : (
            ''
          )}
        </>
        <Col span={showImg ? 8 : 24}>
          <div className='login-box' style={{ marginLeft: formMarginL }}>
            <div className='form'>
              <LoginForm />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}
