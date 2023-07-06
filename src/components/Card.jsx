import { useEffect, useRef } from 'react'
import '../css/Card.scss'
import VanillaTilt from 'vanilla-tilt'
import { Col, Rate } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function Card({ data }) {
  const navigate = useNavigate()

  // console.log('In Card data: ', data)
  //TODO: change to null
  // console.log(data.srv_name)
  if (data.srv_name == undefined) {
    data = null
    // console.log('In if Card data: ', data)
  }

  const cardDOM = useRef(null)
  useEffect(() => {
    // const cardElem = document.querySelector('.card')
    VanillaTilt.init(cardDOM.current, {
      max: 30,
      speed: 3000,
    })
  }, [])

  const handleCardClick = () => {
    console.log('Card Clicked, srv_id: ', data.srv_id)
    navigate(`/service/${encodeURIComponent(data.srv_id)}`) // 通过编码可以解决
  }

  return (
    <div className='card' onClick={handleCardClick}>
      <Col className='wrap'>
        <div className='card' ref={cardDOM}>
          {/* <div className='image'>TODO: img 404</div> */}
          <div className='hide'>Click it to See more!</div>
          <div className='card-img' style={{ width: '80%' }}>
            <img src={data ? data.imgs[0] : ''} alt={data ? data.srv_name : 'img-alt'} />
          </div>
          <div className='details'>
            <h1>{data ? data.srv_name : 'Service Name'}</h1>
            <h3>{data ? data.prv_name : 'Provider name'}</h3>
            <p>{data ? data.description : 'Brief description of the service'}</p>
          </div>
          <div className='rate'>
            <Rate allowHalf value={data ? data.rate : 4.5} />
          </div>
        </div>
      </Col>
    </div>
  )
}
