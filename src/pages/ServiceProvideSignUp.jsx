import { Col, Modal, Row, message, Upload, Button, Form, Input, Radio } from 'antd'
import { useState, useRef, useEffect } from 'react'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import '../css/ServiceProviderSignUp.scss'
// import { db } from '../utils/FirebaseSetup'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { redirect, useNavigate } from 'react-router-dom'
import { auth } from '../utils/FirebaseSetup'
import { addCustomer, addService, addServiceProvider, uploadAvatar, uploadImage } from '../utils/FirebaseAPI'
import { checkEmailFormat, checkPasswordFormat, checkUKPhoneFormat } from '../utils/FormatChecker'
import { setServiceProvider } from '../utils/FirebaseAPI'
import GoogleMapReact from 'google-map-react'

const Marker = ({ text }) => (
  <div style={{ fontSize: '20px' }}>
    <i
      style={{
        width: '10px',
        height: '10px',
        radius: '50%',
        background: 'red',
        display: 'block',
      }}></i>
    {text}
  </div>
)

const beforeUpload = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Avatar must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}

function SignupForm() {
  const [geoCoder, setGeoCoder] = useState()
  const [gps, setGPS] = useState({ lat: 50.9364116, lng: -1.3979611 })
  const [marker, setMarker] = useState(false)
  const navigate = useNavigate()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [popupMsg, setPopupMsg] = useState('Successfully create your account! Now login!')
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState()
  const [imageList, setImageList] = useState([])
  const [fileList, setFileList] = useState([])
  const formRef = useRef(null)

  const findGeo = async () => {
    const { results } = await geoCoder.geocode({ address: formRef.current.getFieldValue('location') })
    //setGPS({ lat: result[0].geometry.location.lat(), lng: result[0].geometry.location.lng() })
    console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng())
    setGPS({ lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() })
    setMarker(true)
  }
  const onMapClicked = async value => {
    setGPS({ lat: value.lat, lng: value.lng })
    const { results } = await geoCoder.geocode({ location: { lat: value.lat, lng: value.lng } })
    //setGPS({ lat: result[0].geometry.location.lat(), lng: result[0].geometry.location.lng() })
    //console.log(results)
    formRef.current.setFieldsValue({ address: results[0].formatted_address })
    setMarker(true)
  }

  const handleApiLoaded = (map, maps) => {
    setGeoCoder(new maps.Geocoder())
  }
  // popup Modal controls
  // START
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handlePreviewCancel = () => setPreviewOpen(false)

  const handlePreview = async file => {
    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj)
    // }
    console.log(file, file.url)
    setPreviewImage(file.url || file.response)
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }

  const addAvatar = async option => {
    try {
      const url = await uploadAvatar(option.file)
      console.log(url)
      setAvatarUrl(url)
      option.onSuccess(url)
    } catch {
      console.log('in add avatar')
      console.log(error)
      message.error('Failed uploading avatar')
    }
  }
  const addImage = async option => {
    try {
      const url = await uploadImage(option.file)
      console.log(url)
      setImageList([...imageList, url])
      console.log(imageList)
      option.onSuccess(url)
    } catch (error) {
      console.log('in add image')
      console.log(error)
      message.error('Failed uploading image')
    }
  }

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)

  const handleAvatarChange = async info => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      const url = await uploadAvatar(info.file)
      setLoading(false)
      setAvatarUrl(url)
    }
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  const handleOk = () => {
    setIsModalOpen(false)
    // redirect('/login')
    navigate('/login')
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  // END

  // Pwd Format check
  const pwdFormatRules = [
    {
      required: true,
      message: 'Please input your password!',
    },
    {
      min: 6,
      message: 'Must be at least 6 characters',
    },
    {
      // pattern: /^(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/,
      pattern: checkPasswordFormat(true),
      message: 'Must contain at least 1 letter, 1 number and 1 special character',
    },
  ]

  // Form submit controls
  // START
  const onFinish = values => {
    console.log('Success:', values)
    const imgList = []
    if (values.image) for (const c of values.image.fileList) imgList.push(c.response)
    const userData = {
      prv_id: '', // use firebase-auth.uid later
      prv_name: values.username,
      description: values.description,
      needupdate: false,
      email: values.email,
      password: values.password,
      phone: values.phone,
      approved: false,
      location: {
        // handle later
        txt: values.address,
        gps: gps,
      },
      avatar:
        values.avatar.file.response ||
        'https://firebasestorage.googleapis.com/v0/b/localservice-381523.appspot.com/o/avatars%2Fdefault.png?alt=media&token=aa794ad1-1304-4a88-bbed-2a2a52f22fb9', // handle later
      imgs: [...imgList],
    }

    console.log(userData)
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user
        userData.prv_id = user.uid

        console.log('Successfully created user: ', user)

        console.log('Sending verifying email...')
        sendEmailVerification(user)

        // add user into ServiceProvider collection
        setServiceProvider(user.uid, userData).then(res => console.log('Add done'))

        // open modal
        showModal()
      })
      .catch(error => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log('Err on creating user:', error.code, error.message)
        setPopupMsg('Oops, it seems you have already signed up. Just login!')
        showModal()
      })
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }
  // END

  return (
    <>
      <Form
        ref={formRef}
        name='basic'
        labelCol={{
          span: 8,
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
        <Row>
          <Col span={8}>
            {/* Username */}
            <Form.Item
              label='Username'
              name='username'
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}>
              <Input className='signup-input' placeholder='Ross' />
            </Form.Item>

            {/* Phone */}
            <Form.Item
              label='Phone'
              name='phone'
              rules={[
                {
                  required: false,
                },
                {
                  pattern: checkUKPhoneFormat(true),
                  message: 'Invalid UK phone number!',
                },
              ]}>
              <Input className='signup-input' placeholder='07579969581' />
            </Form.Item>

            {/* Email */}
            <Form.Item
              label='Email'
              name='email'
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
                {
                  pattern: checkEmailFormat(true),
                  message: 'Please enter the correct email format',
                },
              ]}>
              <Input className='signup-input' placeholder='email@mail.com' />
            </Form.Item>

            {/* Password */}
            <Form.Item label='Password' name='password' rules={pwdFormatRules} hasFeedback>
              <Input.Password className='signup-input' placeholder='Password' />
            </Form.Item>

            {/* Confirm password */}
            <Form.Item
              label='Confirm'
              name='confirmPwd'
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password again!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('The two entered passwords do not match'))
                  },
                }),
              ]}
              hasFeedback>
              <Input.Password className='signup-input' placeholder='Password' />
            </Form.Item>
            {/* Already have one */}
            {/* Create btn */}
          </Col>
          <Col span={8} style={{ marginLeft: '100px' }}>
            {/* Avatar */}
            <Form.Item label='Avatar' name='avatar'>
              <Upload
                name='avatar'
                listType='picture-circle'
                className='avatar-uploader'
                showUploadList={false}
                beforeUpload={beforeUpload}
                // onChange={handleAvatarChange}
                customRequest={addAvatar}>
                {avatarUrl ? <img src={avatarUrl} alt='avatar' style={{ width: '100%' }} /> : uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item label='Image' name='image'>
              <Upload
                name='image'
                listType='picture-card'
                fileList={fileList}
                onChange={handleChange}
                onPreview={handlePreview}
                customRequest={addImage}>
                {fileList && fileList.length >= 3 ? null : uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item label='Description' name='description'>
              <Input.TextArea className='signup-input' placeholder='Description' />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 24,
              }}>
              Already have one?
              <a className='create-one' href='/login'>
                {' '}
                Just login!
              </a>
            </Form.Item>
          </Col>
        </Row>
        <div className='signup-location'>
          <Row className='signup-google-map-container'>
            {/* <Col span={12} style={{ height: '300px' }}> */}
            <GoogleMapReact
              bootstrapURLKeys={{ key: 'AIzaSyArC2oFHyAeSCPIK6AAMbghWW5fL2jExqY' }}
              defaultCenter={{ lat: 50.9364116, lng: -1.3979611 }}
              defaultZoom={15}
              center={gps}
              onClick={onMapClicked}
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}>
              {marker && <Marker lat={gps.lat} lng={gps.lng} text="I'm here" />}
            </GoogleMapReact>
            {/* </Col> */}
          </Row>
          <Row>
            <Col span={12}>
              {/* Show the selected location */}
              <Form.Item name='address' label='Location'>
                <Input placeholder='Please enter the address/postcode the service covers' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Button onClick={findGeo}>Find!</Button>
            </Col>
            {/* show the current gps */}
          </Row>
          <Row>
            <Col span={12}>
              <div style={{ textAlign: 'center' }}>
                <h3>
                  <span style={{ fontSize: '2.3em' }}>lat: {gps.lat.toFixed(4)}</span>
                </h3>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ textAlign: 'center' }}>
                <h3>
                  <span style={{ fontSize: '2.3em' }}>lng:{gps.lng.toFixed(4)}</span>
                </h3>
              </div>
            </Col>
          </Row>
        </div>
        <Row
          className='center-row'
          style={{
            marginTop: '20px',
          }}>
          <Form.Item>
            <Button className='create-btn' type='primary' htmlType='submit'>
              Create!
            </Button>
          </Form.Item>
        </Row>
      </Form>

      {/* Popup Modal */}
      <Modal title='Note' open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {popupMsg}
      </Modal>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handlePreviewCancel}>
        <img
          alt='example'
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </>
  )
}

export default function ServiceProviderSignUp() {
  return (
    <div className='srv-sign-up'>
      <Row justify='center'>
        <Col span={16} className='form-container'>
          <div className='form-container'>
            <Row justify='center'>
              <Col>
                <div className='signup-title'>Service Provider Sign up</div>
              </Col>
            </Row>
            <SignupForm />
          </div>
        </Col>
      </Row>
    </div>
  )
}
