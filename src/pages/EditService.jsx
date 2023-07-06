import { InboxOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons'
import React, { useState, useEffect, useRef } from 'react'
import { updateServiceById, getServicesById, addNotification } from '../utils/FirebaseAPI'
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
import { useParams, useNavigate } from 'react-router-dom'
import { getLoginUserId, getLoginUserName } from '../utils/LoginInfo'
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
function EditService() {
  const [service, setService] = useState({})
  const params = useParams()

  const { TextArea } = Input
  const navigate = useNavigate()
  const formRef = useRef()
  // const [initialData, setInitialData] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false)
  const [loginUserId, setLoginUserId] = useState(getLoginUserId())
  const [loginUserName, setLoginUserName] = useState('')
  const [geoCoder, setGeoCoder] = useState()
  const [msgTitle, setMsgTitle] = useState('')
  const [msgBody, setMsgBody] = useState('')
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
  const [gps, setGPS] = useState({ lat: 50.911, lng: -1.4 })
  const [marker, setMarker] = useState(false)
  const [area, setArea] = useState('')
  const inputRef = useRef(null)

  const plainOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const defaultCheckedList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

  useEffect(() => {
    console.log('----', params, params.id)
    getServicesById(params.id).then(res => {
      const data = res
      console.log('++++', data)
      setService(data)
      formRef.current.setFieldsValue({
        srv_name: data.srv_name,
        price: data.price,
        description: data.description,
        location: data.location.txt,
        category: data.category,
        duration: data.duration,
        total: data.total,
        // images: data.images,
        // videos: data.videos,
        // available: data.available,
        days: data.available_time.days,
        time: data.available_time.time,
        desc: data.desc,
        // available_day: data.available_day,
      })
    })
  }, [])

  const onNameChange = event => {
    setName(event.target.value)
  }

  const showModal = () => {
    setIsModalOpen(true)
  }
  const showNotifyModal = () => {
    setIsNotifyModalOpen(true)
  }

  const handleNotifyTitleChange = e => {
    setMsgTitle(e.target.value)
  }
  const handleNotifyBodyChange = e => {
    setMsgBody(e.target.value)
  }
  const handleNotifyOk = () => {
    const data = {
      msg_id: 'tobe generated',
      msg_type: 'update',
      user_id: 'All',
      user_name: '',
      srv_id: service.srv_id,
      srv_name: service.srv_name,
      prv_name: service.prv_name,
      msg_title: msgTitle,
      msg_body: msgBody,
      needDetail: null,
      time: Date.now(),
      isRead: false,
      jumpLink: `/service/${service.srv_id}`,
    }
    addNotification(data).then(res => {
      console.log(res)
    })
    setIsNotifyModalOpen(false)
  }
  const handleNotifyCancel = () => {
    setIsNotifyModalOpen(false)
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
    //console.log(results)
    for (const c of results[0].address_components) {
      if (c.types.includes('postal_town')) {
        // console.log(c.long_name)
        setArea(c.long_name)
        break
      }
    }
    formRef.current.setFieldsValue({ location: results[0].formatted_address })
    setMarker(true)
  }

  const handleApiLoaded = (map, maps) => {
    setGeoCoder(new maps.Geocoder())
  }

  const handleDeleteClicked = index => {
    // setImagesList(preState => preState.filter((item, i) => i !== index))
    console.log()
  }

  const handleNotifyClicked = index => {
    // console.log()
    showNotifyModal()
  }

  function onFinish(values) {
    updateServiceById(params.id, {
      ...values,
      available_time: {
        days: values.days,
        time: values.time,
      },
      location: {
        txt: values.location,
        area: area,
        gps: gps,
      },
    })
    showModal()
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
              <Form.Item name='srv_name' label={Label('Title')}>
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
              defaultCenter={{ lat: 50.911, lng: -1.4 }}
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
                  lat: <span style={{ fontSize: '2.3em' }}>{gps.lat.toFixed(4)}</span>
                </h3>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ textAlign: 'center' }}>
                <h3>
                  lng:<span style={{ fontSize: '2.3em' }}>{gps.lng.toFixed(4)}</span>
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
              Save
            </Button>
            <Button htmlType='reset'>Reset</Button>
            <Button onClick={handleDeleteClicked}>Delete</Button>
            <Button onClick={handleNotifyClicked}>Notify</Button>
          </Space>
        </Form.Item>
      </Form>
      <Modal title='Note' open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {'Successfully saved your service! You can check it in by clicking OK'}
      </Modal>
      <Modal title='Notify' open={isNotifyModalOpen} onOk={handleNotifyOk} onCancel={handleNotifyCancel} okText='add'>
        <Row>
          <h3> Title</h3>
          <Input onChange={handleNotifyTitleChange} />
        </Row>
        <Row>
          <h3> Content</h3>
          <TextArea onChange={handleNotifyBodyChange} />
        </Row>
      </Modal>
    </div>
  )
}

export default EditService
