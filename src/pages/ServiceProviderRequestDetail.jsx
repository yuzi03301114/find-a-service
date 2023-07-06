import { Steps, Form, Button, Input, Checkbox } from 'antd'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import constructStepData from '../utils/ConstructStepData'
import { getRequestById, updateRequestById } from '../utils/FirebaseAPI'

const ServiceProviderRequestDetail = () => {
  const [index, setIndex] = useState(0)
  const [stepList, setStepList] = useState([])
  const [ServiceProviderRequestDetail, setServiceProviderRequestDetail] = useState({})
  const params = useParams()
  const changeStatus = v => {
    console.log(params.id, { ...ServiceProviderRequestDetail, status: v })
    updateRequestById(params.id, { ...ServiceProviderRequestDetail, status: v }).then(data => {
      window.location.reload()
    })
  }

  useEffect(() => {
    getRequestById(params.id).then(request => {
      const data = request.data()
      setServiceProviderRequestDetail(data)
      const [stepList, index] = constructStepData(data.status)
      setStepList(stepList)
      setIndex(index)
    })
  }, [])
  return (
    <div>
      <Steps direction='vertical' current={index} items={stepList} />
      <Form
        name='basic'
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}>
        <Form.Item label='Customer'>
          <Input readOnly value={ServiceProviderRequestDetail.customer} />
        </Form.Item>

        <Form.Item label='Service Provider'>
          <Input readOnly value={ServiceProviderRequestDetail.serviceprovider} />
        </Form.Item>

        <Form.Item label='Detail'>
          <Input readOnly value={ServiceProviderRequestDetail.detail} />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}>
          {/* show following componets only when status is 0 */}
          {/* {ServiceProviderRequestDetail.status === '0' && ( */}
          {
            <div>
              <Button type='primary' onClick={() => changeStatus(1)}>
                Reject
              </Button>
              <Button type='primary' onClick={() => changeStatus(2)}>
                Accept
              </Button>
              <Button type='primary' onClick={() => changeStatus(3)}>
                Require More Detail
              </Button>
            </div>
          }
        </Form.Item>
      </Form>
    </div>
  )
}
export default ServiceProviderRequestDetail
