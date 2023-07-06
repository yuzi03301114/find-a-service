import { useEffect, useRef, useState } from 'react'
import '../css/ServiceDetail.scss'
import { Col, Image, Rate, Row } from 'antd'
import ServiceReviews from '../components/ServiceReviews'
import { useParams } from 'react-router-dom'
import { getReviews, getServicesById } from '../utils/FirebaseAPI'
import mapboxgl from '../utils/MapboxConfig.js'
import ReactPlayer from 'react-player'
import { RequestSubmitter } from '../components/RequestSubmitter'
import StatusBar from '../components/StatusBar'

function DescriptionBox({ data }) {
  return (
    <div className='desc-box'>
      {/* <Row justify='center'>
        <Col className='srv_name'>{data.srv_name + data.srv_name}</Col>
      </Row> */}
      <Row justify='start'>
        <div className='details'>
          <div className='row-box'>
            <span className='key rate-key'>Rating: </span>
            <span className='val rate-val'>
              <Rate disabled value={data.reputation} />
            </span>
          </div>
          <div className='row-box'>
            <span className='key price-key'>Price: </span>
            <span className='val price-val'>&pound;{data.price}</span>
          </div>
          <div className='row-box'>
            <span className='key category-key'>Category: </span>
            <span className='val category-val'>{data.category}</span>
          </div>
          <div className='row-box'>
            <span className='key duration-key'>Service duration: </span>
            <span className='val duration-val'>{data.duration} min</span>
          </div>
          <div className='row-box'>
            <span className='key provider-key'>Service Provider: </span>
            <span className='val provider-name'>{data.prv_name}</span>
          </div>
          <div className='row-box'>
            <span className='key available-key'>Available time slots: </span>
            <span className='val available-val'>
              {data.available_time.time} on {data.available_time.days.toString()}
            </span>
          </div>
          <div className='row-box'>
            <span className='key desc-key'>Service description:</span>
            <br />
            <span className='val desc-val'>{data.desc}</span>
          </div>
          <div className='row-box'>
            <span className='key location-key'>Location: </span>
            <span className='val location-val'>{data.location.area}</span>
          </div>
        </div>
      </Row>
      <Row>
        <ProviderMap coords={data.location.gps} />
      </Row>
    </div>
  )
}

function ProviderMap({ coords }) {
  const mapContainerRef = useRef(null)

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: coords,
      zoom: 15,
    })

    new mapboxgl.Marker().setLngLat(coords).addTo(map)
  }, [])

  return <div className='mapbox' ref={mapContainerRef}></div>
}

export default function ServiceDetail() {
  const { srv_id } = useParams()

  const [serviceData, setServiceData] = useState(null)
  const [reviewData, setReviewData] = useState(null)
  const [imgAlbum, setImgAlbum] = useState(null)
  const [visible, setVisible] = useState(false) // album ctrl

  const [imgAlbumSize, setImgAlbumSize] = useState(14)
  const [detailBoxSize, setDetailBoxSize] = useState(10)

  // fetch service+review data
  let ignore = false
  useEffect(() => {
    // 不可以再 effect回调上加 async 因为会返回 Promise，不属于 useEffect 回调格式
    if (!ignore) {
      // getServicesById(srv_id).then(
      //   res => {
      //     console.log(res)
      //     // console.log(res.data())
      //     const imgs = res.imgs.map((item, index) => {
      //       return <Image src={item} key={`img-${index}`} />
      //     })
      //     setServiceData(res)
      //     setImgAlbum(imgs)
      //   },
      //   err => {
      //     console.log(err)
      //   }
      // )

      const getData = async () => {
        const srvData = await getServicesById(srv_id)
        const rvwData = await getReviews(srv_id)
        console.log('geting rvw data: srv_id=', srv_id, 'rvwData:', rvwData)
        const imgs = srvData.imgs.map((item, index) => {
          return <Image src={item} key={`img-${index}`} />
        })

        setServiceData(srvData)
        setReviewData(rvwData)
        setImgAlbum(imgs)
      }

      getData()
    }

    return () => {
      ignore = true
    }
  }, [])

  // RWD
  const RWDController = () => {
    const viewportW = window.innerWidth
    if (viewportW < 1500) {
      setImgAlbumSize(24)
      setDetailBoxSize(24)
    } else {
      setImgAlbumSize(14)
      setDetailBoxSize(10)
    }
  }

  window.addEventListener('load', () => {
    RWDController()
  })

  window.addEventListener('resize', () => {
    RWDController()
  })

  return (
    <div className='service-detail'>
      {/* Status bar */}
      <StatusBar />

      {/* Video box */}
      <Row>
        {/* <Col span={4} style={{ backgroundColor: 'black' }}></Col> */}
        <Col className='video-box' span={24}>
          <ReactPlayer
            url={serviceData ? serviceData.videos[0] : ''}
            // url='https://www.youtube.com/watch?v=kr0RisHSDwI'
            width={'100%'}
            height={'100%'}
            muted
            playing
            loop
            controls
          />
        </Col>
        {/* <Col span={4} style={{ backgroundColor: 'black' }}></Col> */}
      </Row>

      {/* Service name head */}
      <Row justify='center'>
        <div className='srv_name'>{serviceData ? serviceData.srv_name : ''}</div>
      </Row>
      {/* Detail box */}
      <Row className='detail-box' justify='space-around'>
        {/* Imgs */}
        <Col className='img-container' span={imgAlbumSize}>
          <Row className='previewer'>
            <Image
              preview={{ visible: false }}
              width={'100%'}
              src={serviceData ? serviceData.imgs[0] : ''}
              onClick={() => setVisible(true)}
            />
            <div style={{ display: 'none' }}>
              <Image.PreviewGroup
                preview={{
                  visible,
                  onVisibleChange: vis => setVisible(vis),
                }}>
                {imgAlbum}
              </Image.PreviewGroup>
            </div>
          </Row>
          <Row justify='center'>
            <Col>
              <div className='img-hint'>👆 Click it for more!</div>
            </Col>
          </Row>
        </Col>
        {/* Service description */}
        <Col className='description-container' span={detailBoxSize}>
          {serviceData ? <DescriptionBox data={serviceData} /> : ''}
        </Col>
      </Row>

      {/* Request box */}
      <Row>
        {serviceData ? (
          <RequestSubmitter
            srv_id={srv_id}
            prv_id={serviceData.prv_id}
            srv_name={serviceData.srv_name}
            prv_name={serviceData.prv_name}
            price={serviceData.price}
            duration={serviceData.duration}
            remain={serviceData.remain}
            total={serviceData.total}
          />
        ) : (
          ''
        )}
      </Row>

      {/* Review List */}
      <div className='review-area'>
        <Row>
          <Col className='review-head' span={24}>
            Top Reviews From Previous Customers
          </Col>
        </Row>
        <ServiceReviews data={reviewData} />
      </div>
    </div>
  )
}
