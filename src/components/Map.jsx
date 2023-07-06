import { Row } from 'antd'
import '../css/Map.scss'
import mapboxgl from '../utils/MapboxConfig.js'
import { useEffect, useRef, useState } from 'react'
import * as turf from '@turf/turf'

const drawCircle = (map, longitude, latitude, radius) => {
  // const radius = 1 // 单位为千米
  const options = {
    steps: 64, // 圆形边缘的分段数
    units: 'kilometers',
  }
  const circle = turf.circle([longitude, latitude], radius, options)

  const sourceID = 'circle'
  const layerID = 'circle-layer'

  // Check if source already exists
  if (map.getSource(sourceID)) {
    map.removeLayer(layerID)
    map.removeSource(sourceID)
  }

  map.addSource(sourceID, {
    type: 'geojson',
    data: circle,
  })

  map.addLayer({
    id: layerID,
    type: 'line',
    source: sourceID,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#3388FF',
      'line-opacity': 0.8,
      'line-width': 2,
      'line-dasharray': [2, 2], // 值为一个长度为2的数组，其中第一个值表示实线的长度，第二个值表示空白的长度
    },
  })

  return {
    sourceID: sourceID,
    layerID: layerID,
  }
}

export default function Map({ data, radius }) {
  console.log('loading map')

  const mapContainerRef = useRef(null)
  const map = useRef(null)

  const [dataMarkers, setDataMarkers] = useState([])

  const currUserCoords = useRef(null)

  const addMarkers = data => {
    const markers = data.map(item => {
      const marker = new mapboxgl.Marker().setLngLat(item.location.gps).addTo(map.current)

      console.log('[in addMarkers() ] data: ', item)

      const popupCard = `<div className='popup'>
      <h3><a href='/service/${encodeURIComponent(item.srv_id)}'>${item.srv_name}</a></h3>
      <div>$ ${item.price}</div>
      <div>Provided By ${item.prv_name}</div>

    </div>`
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupCard)
      marker.setPopup(popup)
      return marker
    })
    setDataMarkers([...dataMarkers, ...markers])
  }

  const clearMarkers = () => {
    console.log('[in clearMarkers() ] dataMarkers: ', dataMarkers)
    dataMarkers.forEach(marker => {
      console.log('[in forEach ] marker: ', marker)
      marker.remove()
    })
    setDataMarkers([])
  }

  // START: init map [DO NOT CHANGE THIS CODE, RG(hs5n22@soton.ac.uk) 2023.05.04]
  let ignore = false
  useEffect(() => {
    if (navigator.geolocation && !ignore) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lng = position.coords.longitude
          const lat = position.coords.latitude

          currUserCoords.current = { lng: lng, lat: lat }

          console.log('init map: ', map.current)
          map.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            // center: [-1.4001991, 50.9434623], // Glen Eyre
            center: [lng, lat], // Glen Eyre
            zoom: 12,
          })

          addMarkers(data)

          // Add geolocate control to the map.
          const geolocateCtrl = new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
              // zoom: 12, // HINT: geolacte zoom level 【no use】
            },
            // When active the map will receive updates to the device's location as it changes.
            trackUserLocation: true,
            // Draw an arrow next to the location dot to indicate which direction the device is heading.
            showUserHeading: true,
            showAccuracyCircle: false, // 禁用圆形精度圈
          })

          // data.forEach(item => {
          //   new mapboxgl.Marker().setLngLat(item.location.gps).addTo(map.current)
          // })

          map.current.addControl(geolocateCtrl)

          map.current.on('load', () => {
            // trgger loate
            geolocateCtrl.trigger()

            geolocateCtrl.on('geolocate', position => {
              const { longitude, latitude } = position.coords

              // console.log(radius)
              // console.log(map.current.getZoom())
              drawCircle(map.current, longitude, latitude, radius)
              map.current.setZoom(13) // HINT: 直接通过 geolocateCtrl 配置 zoom范围 无效
            })
          })
        },
        err => {
          console.error('Please enable location service! Err: ', err)
        },
        {
          enableHighAccuracy: true,
        }
      )
    }

    return () => {
      ignore = true
      if (map.current) {
        console.log('[unmount]Removing map...')
        map.current.remove()
        // map.current.removeSource('circle')
        // map.current.removeLayer('circle-layer')
      }
    }
  }, [])
  // END: init map

  // START: hanlde radius change [DO NOT CHANGE THIS CODE, RG(hs5n22@soton.ac.uk) 2023.05.04]
  useEffect(() => {
    console.log('In map radius: ', radius)
    if (map.current) {
      // map center 会随着用户拖拽变化
      // const { lng, lat } = map.current.getCenter()
      // console.log('Map.center: ', lng, lat)

      // 所以要记录用户坐标
      const { lng, lat } = currUserCoords.current
      console.log('Current user coords: ', lng, lat)

      // const source = map.current.getSource('circle')
      // const layer = map.current.getLayer('circle-layer')
      // console.log('source: ', source)
      // console.log('layer: ', layer)

      // 下面的不需要，drawCircle 自带移重
      // map.current.removeLayer('circle-layer')
      // map.current.removeSource('circle')

      drawCircle(map.current, lng, lat, radius)
    }
  }, [radius])
  // END: hanlde radius change

  // START: hanlder data markers
  useEffect(() => {
    if (map.current) {
      console.log('Current markers: ', dataMarkers)
      console.log('Marker data: ', data)
      console.log('Re-drawing markers with new data...')
      clearMarkers()
      addMarkers(data)
    }
  }, [data])
  // END: hanlder data markers

  return (
    <Row className='map-container'>
      <div id='map' ref={mapContainerRef}></div>
    </Row>
  )
}
