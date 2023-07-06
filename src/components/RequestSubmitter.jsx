import { Calendar, Col, DatePicker, Row, Form, Input, Button, Modal } from 'antd'
import '../css/RequestSubmitter.scss'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import mapboxgl from '../utils/MapboxConfig.js'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { useForm } from 'antd/es/form/Form'
import { addRequest } from '../utils/FirebaseAPI'
import { useLocation, useNavigate } from 'react-router-dom'

export function RequestSubmitter({ srv_id, srv_name, prv_id, prv_name, price, duration, total, remain }) {
  const navigate = useNavigate()
  const [form] = useForm()
  const [date, setDate] = useState(dayjs())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { TextArea } = Input

  // START: Geocoder crtls
  const handleGeocoderResult = e => {
    form.setFieldsValue({
      location: e.result,
    })
  }

  let ignore = false
  useEffect(() => {
    if (!ignore && remain) {
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        language: 'en-GB',
        countries: 'gb', // limit search result in UK
        style: 'mapbox://styles/mapbox/streets-v12',
        // types: 'country,region,place,postcode,locality,neighborhood',
      })

      geocoder.addTo('#geocoder')

      // Get the geocoder results container.
      const results = document.getElementById('result')

      // Add geocoder result to container.
      // geocoder.on('result', e => {
      //   // results.innerText = JSON.stringify(e.result, null, 2)
      //   console.log(e.result)
      // })

      geocoder.on('load', function () {
        console.log('geocoder loading...')
        if (remain == 0) {
          var input = document.querySelector('.mapboxgl-ctrl-geocoder input[type="text"]')
          console.log(input)
          input.disabled = true
        }
      })

      geocoder.on('result', handleGeocoderResult)

      // Clear results container when search is cleared.
      geocoder.on('clear', () => {
        // results.innerText = ''
      })
    }

    return () => {
      ignore = true
    }
  }, [])
  // END: Geocoder ctrls

  // START: DatePicker ctrl
  const getNow = () => {
    const now = dayjs()
      .minute(Math.ceil(dayjs().minute() / duration) * duration)
      .second(0)
    return dayjs(now.format('YYYY-MM-DD HH:mm'))
  }

  const disabledDate = currentTime => {
    return currentTime && currentTime.isBefore(dayjs())
  }

  // const onChange = (value, dateString) => {
  //   console.log('Selected Time: ', value)
  //   console.log('Formatted Selected Time: ', dateString)
  // }

  const handleDateChange = value => {
    setDate(value)
  }

  const onOk = value => {
    console.log('onOk: ', value)
  }
  // END: DatePicker ctrl

  // START: Form ctrls
  const onFinish = values => {
    console.log('Success:', values)
    const loginID = localStorage.getItem('loginID')
    if (loginID) {
      const reqData = {
        req_id: null, // generate later
        user_id: loginID,
        prv_id: prv_id,
        srv_id: srv_id,
        srv_name: srv_name,
        prv_name: prv_name,
        price: price,
        desc: values.description,
        req_time: values.time.valueOf(), // HINT: timestamp
        location: {
          txt: values.location.place_name ? values.location.place_name : values.location.text,
          gps: values.location.center,
        },
        status: 'pending',
        isReviewed: false, // TODO: review flag
      }
      console.log(reqData)
      addRequest(reqData).then(res => {
        console.log('Add request Successfully: ', res)
        // HINT: redirect to requests history page
        navigate(`/mypage/${loginID}/requests`)
      })
    } else {
      // TODO: jump to login [done]
      showModal()
      console.log(loginID)
    }
  }
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }
  // END: Form ctrls

  // START: Modal ctrls
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleModalOk = () => {
    setIsModalOpen(false)
    localStorage.setItem('redirect', window.location.pathname)
    navigate('/login')
  }
  const handleModalCancel = () => {
    setIsModalOpen(false)
  }
  //END: Modal ctrls

  return (
    <Col className='req-box' span={24}>
      <Modal title='Note' open={isModalOpen} onOk={handleModalOk} onCancel={handleModalCancel}>
        Please log in to make a service request
      </Modal>
      <Row justify='center' className='book-now'>
        Request this service NOW!
      </Row>
      <Row justify='center'>
        <div className='reservation-status'>
          <span>
            Current reservations:{' '}
            <span className='booked'>
              {total - remain}/{total}
            </span>
          </span>
          <span>
            {remain != 0 ? (
              <span>
                {' '}
                Remaining request quantity: <span className='remain'>{remain}</span>
              </span>
            ) : (
              <span className='fully-booked'>Oops, fully booked!</span>
            )}
          </span>
        </div>
      </Row>
      <Row justify='center'>
        <Col>
          <Form
            disabled={remain == 0 ? true : false}
            form={form}
            name='basic'
            layout='vertical'
            // labelCol={{
            //   span: 8,
            // }}
            // wrapperCol={{
            //   span: 16,
            // }}
            // style={
            //   {
            //     // maxWidth: 600,
            //   }
            // }
            initialValues={{
              time: getNow(),
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete='off'>
            {/* Description */}
            <Form.Item
              label='Describe your need'
              name='description'
              rules={[
                {
                  // required: true,
                  // message: '',
                },
              ]}>
              <TextArea
                className='desc-txt-area'
                showCount
                maxLength={300}
                style={{
                  height: 120,
                  resize: 'none',
                }}
                placeholder='Say something to your service provider...'
              />
            </Form.Item>

            {/* DatePicker */}
            <Form.Item
              label={`Pick Time (This service duration is ${duration})`}
              name='time'
              style={{ color: 'aliceblue' }}
              rules={[
                {
                  required: true,
                  message: 'Please select a time and press OK!',
                },
              ]}>
              <DatePicker
                className='datepicker'
                format='YYYY-MM-DD HH:mm'
                showTime={{ format: 'HH:mm', minuteStep: duration, secondStep: null }}
                // defaultValue={getNow()} // HINT: use initialValue on Form instead
                disabledDate={disabledDate}
                // initialValue={getNow()}
                showNow={false}
                onChange={handleDateChange}
                onOk={onOk}
              />
            </Form.Item>

            {/* Location Picker */}
            <Form.Item
              label='Pick your location'
              name='location'
              rules={[
                {
                  required: true,
                  message: 'Please choose your location!',
                },
              ]}>
              {remain ? (
                <div>
                  <div id='geocoder'></div>
                  <pre id='result'></pre>
                </div>
              ) : (
                ''
              )}
            </Form.Item>

            {/* Request btn */}
            <Form.Item
              wrapperCol={{
                // offset: 8,
                span: 24,
              }}>
              <Row justify='center'>
                {' '}
                <Button id='req-btn' type='primary' htmlType='submit'>
                  Request!
                </Button>
              </Row>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Col>
  )
}
