import { InboxOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons'
import { useState, useRef } from 'react'
import GoogleMapReact from 'google-map-react'
import {
  Modal,
  Button,
  Checkbox,
  Col,
  Form,
  InputNumber,
  Radio,
  Rate,
  Divider,
  // Space,
  Row,
  Select,
  Slider,
  Space,
  // Divider,
  Switch,
  Upload,
  Calendar,
  theme,
  Input,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import { uploadImage, addService, uploadVideo, addFakeRequestData } from '../utils/FirebaseAPI'
import { getLoginUserId, getLoginUserName } from '../utils/LoginInfo'
import { useEffect } from 'react'
import '../css/AddService.scss'
const { Option } = Select
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 20,
  },
}
const normFile = e => {
  console.log('Upload event:', e)
  if (Array.isArray(e)) {
    return e
  }
  return e?.fileList
}
const Label = text => (
  <span
    style={{
      color: 'black',
      fontWeight: 'bold',
      fontSize: '20px',
    }}>
    {text}
  </span>
)

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
const onPanelChange = newValue => {
  console.log(newValue)
}
const AddService = () => {
  const { TextArea } = Input
  const navigate = useNavigate()
  const formRef = useRef()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loginUserId, setLoginUserId] = useState(getLoginUserId())
  const [loginUserName, setLoginUserName] = useState('')
  const [geoCoder, setGeoCoder] = useState()
  const [area, setArea] = useState('')
  const [items, setItems] = useState([
    'Cleaning',
    ' Babysitting',
    'Pest control',
    'Plumbing',
    'Electrical repairs',
    'Beauty',
  ])
  const [name, setName] = useState('')
  const [imagesList, setImagesList] = useState([])
  const [videosList, setVideosList] = useState([])
  const [gps, setGPS] = useState({ lat: 50.9364116, lng: -1.3979611 })
  const [marker, setMarker] = useState(false)
  const inputRef = useRef(null)

  const plainOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const defaultCheckedList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

  useEffect(() => {
    const getUserName = async () => {
      const name = await getLoginUserName()
      setLoginUserName(name)
      // console.log(loginUserId, loginUserName)
    }
    getUserName()
  }, [])

  const onNameChange = event => {
    setName(event.target.value)
  }

  const showModal = () => {
    setIsModalOpen(true)
  }
  const findGeo = async () => {
    const { results } = await geoCoder.geocode({ address: formRef.current.getFieldValue('location') })
    //setGPS({ lat: result[0].geometry.location.lat(), lng: result[0].geometry.location.lng() })
    console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng())
    setGPS({ lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() })
    setMarker(true)
  }
  const addItem = e => {
    e.preventDefault()
    setItems([...items, name || `New item ${index++}`])
    setName('')
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }
  const handleOk = () => {
    setIsModalOpen(false)
    // redirect('/login')
    navigate('/service-provider/manage-service')
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onFinish = values => {
    console.log('Received values of form: ', values)
    addService({
      ...values,
      srv_id: 'tobegenerated',
      prv_id: loginUserId,
      prv_name: loginUserName,
      location: { txt: values.location, area: area, gps: [gps.lng, gps.lat] },
      imgs: imagesList,
      videos: videosList,
      rate: 0,
      available_time: {
        days: values.days,
        time: values.time,
      },
      remain: values.total,
    })
    console.log({
      ...values,
      srv_id: 'tobegenerated',
      prv_id: 'imid',
      prv_name: 'imname',
      location: { txt: values.location, gps: gps },
      imgs: imagesList,
      videos: videosList,
    })
    showModal()
  }

  async function addToImageList(option) {
    try {
      const url = await uploadImage(option.file)
      console.log(url)
      setImagesList(preState => [...preState, url])
      option.onSuccess(url)
    } catch {
      //message("Failed uploading " + image.name);
    }
  }

  async function addToVideoList(option) {
    try {
      const url = await uploadVideo(option.file)
      console.log(url)
      setVideosList(preState => [...preState, url])
      option.onSuccess(url)
    } catch {
      //message("Failed uploading " + image.name);
    }
  }

  const onMapClicked = async value => {
    setGPS({ lat: value.lat, lng: value.lng })
    const { results } = await geoCoder.geocode({ location: { lat: value.lat, lng: value.lng } })
    //setGPS({ lat: result[0].geometry.location.lat(), lng: result[0].geometry.location.lng() })
    console.log(results)
    formRef.current.setFieldsValue({ location: results[0].formatted_address })
    for (const c of results[0].address_components) {
      if (c.types.includes('postal_town')) {
        // console.log(c.long_name)
        setArea(c.long_name)
        break
      }
    }
    setMarker(true)
  }

  const handleApiLoaded = (map, maps) => {
    setGeoCoder(new maps.Geocoder())
  }

  return (
    <div className='add-service-area'>
      <Form
        name='validate_other'
        {...formItemLayout}
        onFinish={onFinish}
        ref={formRef}
        style={{
          width: '80%',
        }}
        layout='horizontal'>
        <div className='add-service-basic'>
          <Row className='add-service-head'>
            {/* <Col span={12}> */}
            <h1>{'Step 1: Basic Infomation'}</h1>
            {/* </Col> */}
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item name='srv_name' label={Label('Name')}>
                <Input placeholder='Please enter the name of the service' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='price' label={Label('Price')}>
                <InputNumber addonAfter='£' />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item name='total' label={Label('Total')}>
                <InputNumber control='true' min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='duration' label={Label('Duration')}>
                <InputNumber control='true' min={1} addonAfter='min' />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item name='category' label={Label('Category')}>
                <Select
                  style={{
                    width: 300,
                  }}
                  // placeholder='custom dropdown render'
                  dropdownRender={menu => (
                    <>
                      {menu}
                      <Divider
                        style={{
                          margin: '8px 0',
                        }}
                      />
                      <Space
                        style={{
                          padding: '0 8px 4px',
                        }}>
                        <Input placeholder='Please enter item' ref={inputRef} value={name} onChange={onNameChange} />
                        <Button type='text' icon={<PlusOutlined />} onClick={addItem}>
                          Add item
                        </Button>
                      </Space>
                    </>
                  )}
                  options={items.map(item => ({
                    label: item,
                    value: item,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item name='days' label={Label('Days')}>
                <Checkbox.Group options={plainOptions} defaultValue={defaultCheckedList} layout='vertical' />
              </Form.Item>
            </Col>
          </Row>
          <Row justify='start'>
            {/* 靠左 */}
            <Col span={12}>
              <Form.Item name='time' label={Label('Time')}>
                <Input placeholder='Please enter the time ' />
              </Form.Item>
            </Col>
          </Row>
        </div>
        {/* use googlemapreact to get location, location:{txt:"",gps:[x,y]} */}

        <div className='add-service-location'>
          <Row className='add-service-head'>
            {/* <Col span={12}> */}
            <h1>{'Step 2: Location'}</h1>
            {/* </Col> */}
          </Row>
          <Row className='google-map-container'>
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
              <Form.Item name='location' label={Label('Location')}>
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
        <div className='add-service-multimedia'>
          <Row className='add-service-head'>
            {/* <Col span={12}> */}
            <h1>{'Step 3: Describe the service'}</h1>
            {/* </Col> */}
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label={Label('Images')}>
                <Form.Item
                  valuePropName='imageList'
                  getValueFromEvent={e => (Array.isArray(e) ? e : e && e.imageList)}
                  noStyle>
                  <Upload.Dragger name='image' listType='picture' customRequest={addToImageList}>
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                  </Upload.Dragger>
                </Form.Item>
              </Form.Item>
            </Col>
            <Col span={12}>
              {imagesList.map((file, index) => (
                <img
                  key={'preview-picture' + index}
                  src={file}
                  alt={file.name}
                  style={{ width: '100px', height: '100px', margin: '5px' }}
                />
              ))}
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label={Label('Video')}>
                <Form.Item
                  valuePropName='videoList'
                  getValueFromEvent={e => (Array.isArray(e) ? e : e && e.videoList)}
                  noStyle>
                  <Upload.Dragger name='video' listType='picture' customRequest={addToVideoList}>
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                  </Upload.Dragger>
                </Form.Item>
              </Form.Item>
            </Col>
            <Col span={12}></Col>
          </Row>
          <Row>
            <Col span={18}>
              <Form.Item name='desc' label={Label('Description')}>
                <TextArea placeholder='Enter your description.' autoSize />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <Form.Item
          wrapperCol={{
            span: 12,
            offset: 6,
          }}>
          <Space>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
            <Button htmlType='reset'>reset</Button>
          </Space>
        </Form.Item>
      </Form>
      <Modal title='Note' open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {'Successfully add your service! You can check it in by clicking OK'}
      </Modal>
    </div>
  )
}
export default AddService
