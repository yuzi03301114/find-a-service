import { Button, Carousel, Col, Image, List, Row, Select } from 'antd'
import '../css/ServiceFinder.scss'
// import Search from 'antd/es/input/Search'
import { Input } from 'antd'
const { Search } = Input
import { useEffect, useRef, useState } from 'react'
// import { useImmer } from 'use-immer'
// TODO: remove test data
// import testData from '../json/ServiceDataTest.json'
import Card from '../components/Card'
import { getRecommendServices, getSearchedServices } from '../utils/FirebaseAPI'
import { useImmer } from 'use-immer'
import CarouselDateTest from '../json/CarouselDataTest.json'
import Map from '../components/Map'
import { useNavigate, useParams } from 'react-router-dom'
import StatusBar from '../components/StatusBar'

function CardsArea({ isSearched, searchTxt = null, defaultData = null }) {
  const [data, setData] = useImmer(defaultData)

  const cardRWDController = () => {
    const viewportW = window.innerWidth
    console.log(viewportW)

    if (viewportW > 1200) {
      setPagesize(8)
      setPageCol(4)
    } else if (viewportW > 1000 && viewportW < 1200) {
      setPagesize(6)
      setPageCol(3)
    } else if (viewportW > 700 && viewportW < 1000) {
      setPagesize(4)
      setPageCol(2)
    } else {
      setPagesize(1)
      setPageCol(1)
    }
  }

  useEffect(() => {
    if (isSearched && searchTxt != '') {
      // searchTxt = 'Cleaning'
      // TODO: 增强算法，剔除特殊符号
      // setIsSearched(false)
      let possibleCats = searchTxt.split(' ')
      // console.log('possibleCats: ', possibleCats)
      getSearchedServices(possibleCats).then(res => {
        setData(res)
        // console.log(data)
      })
    } else {
      setData(defaultData)
      // setIsSearched(false)
    }
  }, [isSearched])

  // pagesize change with viewport
  const [pagesize, setPagesize] = useState(10)
  const [pageCol, setPageCol] = useState(5)

  // HINT: onload 不触发， 因为 CardsArea 组件不是整个 Window load
  // window.onload = () => {
  //   let viewportW = window.innerWidth
  //   console.log(viewportW)

  //   if (viewportW > 1200) {
  //     setPagesize(8)
  //     setPageCol(4)
  //   } else if (viewportW > 1000 && viewportW < 1200) {
  //     setPagesize(6)
  //     setPageCol(3)
  //   } else if (viewportW > 700 && viewportW < 1000) {
  //     setPagesize(4)
  //     setPageCol(2)
  //   } else {
  //     setPagesize(1)
  //     setPageCol(1)
  //   }
  // }

  // HINT: use effect to adjust when Componet re-render
  useEffect(() => {
    cardRWDController()
  }, [])

  // window.onresize = () => {
  //   cardRWDController()
  // }

  // HINT: 上面的写法多次定义会被覆盖，用下面的写法可以添加多个事件监听
  window.addEventListener('resize', () => {
    cardRWDController()
  })

  return (
    <div className='cards-area'>
      <Row className='title' justify='center'>
        <Col className='head' span={24}>
          {isSearched && searchTxt !== '' ? 'Search results' : 'Recommended Services'}
        </Col>
      </Row>
      <div className='card-list-container'>
        {data ? (
          <List
            pagination={{
              onChange: page => {
                console.log(page)
              },
              pageSize: pagesize,
              position: 'bottom',
              align: 'center',
            }}
            grid={{
              gutter: 20,
              column: pageCol,
            }}
            dataSource={data}
            renderItem={(item, index) => (
              <List.Item>
                <Card key={`card-${index}`} data={item} />
              </List.Item>
            )}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

function RecommendCarousel({ data }) {
  const navigate = useNavigate()

  // click on a img , then navigate to its service page
  const handleCarouselClick = e => {
    // 这个由于是变量定义的函数不会自动提升，所以必须放在下面的调用之前
    console.log(e.target)
    console.log(e.target.alt)
    const srv_id = e.target.alt
    // TODO: 添加跳转详细页【done】
    // navigate(`/service/${srv_id}`) // 测试的 id 是 #srv-123， # 会被解析为 URL 片段
    navigate(`/service/${encodeURIComponent(srv_id)}`) // 通过编码可以解决
  }

  const imgs = data.map((item, index) => {
    return (
      <div className={`img-pair ${'pair-' + index}`} key={`img-${index}`} onClick={handleCarouselClick}>
        <img src={item.imgs[0]} alt={item.srv_id} />
        <img src={item.imgs[1]} alt={item.srv_id} />
      </div>
    )
  })

  return (
    <Col className='carousel' span={24}>
      <Carousel autoplay>{imgs}</Carousel>
    </Col>
  )
}

export default function ServiceFinder() {
  const iptSearch = useRef(null)

  const [radius, setRadius] = useState(1)

  const [isSearched, setIsSearched] = useState(false)
  const [searchTxt, setSearchTxt] = useState('')

  const [recommendData, setRecommendData] = useState(null)
  const [searchedData, setSearchedData] = useState(null)

  const selectRadius = [...Array(6).keys()].map((_, index) => {
    const value = 0.5 * (index + 1)
    return {
      value: parseFloat(value.toFixed(1)),
      label: `${value.toFixed(1)} km`,
    }
  })

  // START: fetch recommend data
  let ignore = false
  useEffect(() => {
    if (!ignore) {
      console.log('fetching recommend data...')
      // TODO: change the recommend amount
      getRecommendServices().then(res => {
        console.log(res)
        setRecommendData(res)
      })
    }
    return () => {
      ignore = true
    }
  }, [])
  // END: fetch recommend data

  function handleSearch() {
    const ipt = iptSearch.current
    ipt.input.blur()

    const _searchTxt = ipt.input.value

    setIsSearched(true)
    setSearchTxt(_searchTxt)

    // HINT: fetch searched result
    let possibleCats = _searchTxt.split(' ')
    // console.log('possibleCats: ', possibleCats)
    getSearchedServices(possibleCats).then(res => {
      console.log('[in handleSearch() ]Searched res: ', res)
      setSearchedData(res)
      // console.log(data)
    })
  }

  function handleSearchChange(event) {
    const value = event.target.value
    console.log(`User input: ${value}`)
    setSearchTxt(value)
    setIsSearched(false)
  }

  function handleReset() {
    setRadius(1)
    setSearchTxt('')
    setIsSearched(false)
    setSearchedData(null)
  }

  function handleSelectChange(value) {
    console.log('Select value: ', value)
    setRadius(value)
  }

  return (
    <div className='service-finder'>
      {recommendData ? (
        <div className='page-loader'>
          {/* Status bar */}
          <StatusBar />
          {/* Carousel */}
          <Row justify='center'>
            <RecommendCarousel data={recommendData} />
          </Row>
          {/* Head: Find Your Favorite Service! */}
          <Row justify='center'>
            <Col>
              <div className='head'>Find Your Favorite Service!</div>
            </Col>
          </Row>
          {/* Map box */}
          <Map data={searchedData ? searchedData : recommendData} radius={radius} />
          {/* Search  */}
          <Row className='search-row' justify='center' align='middle'>
            {/* Search bar */}
            <Col>
              <Search
                className='search-bar'
                ref={iptSearch}
                value={searchTxt}
                onChange={handleSearchChange}
                placeholder='Enter your service...'
                enterButton='Find'
                size='large'
                // style={{
                //   height: '100%',
                // }}
                onSearch={handleSearch}
              />
            </Col>
            {/* Radius select */}
            <Col>
              <Select
                className='radius-select'
                value={radius}
                defaultValue={1}
                // style={{ width: 300 }}
                options={selectRadius}
                onChange={handleSelectChange}
              />
            </Col>
            <Col>
              <Button className='reset-btn' onClick={handleReset}>
                Reset
              </Button>
            </Col>
          </Row>
          {/* Card list  */}
          <CardsArea
            isSearched={isSearched}
            setIsSearched={setIsSearched}
            searchTxt={searchTxt}
            defaultData={recommendData}
          />
        </div>
      ) : (
        'Fetching recommend data...'
      )}
    </div>
  )
}
