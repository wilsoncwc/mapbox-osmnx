import React, { useRef, useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import mapboxgl, { GeoJSONSource, LngLatBoundsLike } from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { bbox } from '@turf/turf'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MAPBOX_TOKEN, MAP_DEFAULT } from '../constants'
import { FeatureCollection } from 'geojson'
import { getIso } from '../services/isochrone/mapbox'

const Mapbox = () => {
  const mapContainer = useRef(null)
  const [lng, setLng] = useState(MAP_DEFAULT.location.lng)
  const [lat, setLat] = useState(MAP_DEFAULT.location.lat)
  const [zoom, setZoom] = useState(MAP_DEFAULT.zoom)

  useEffect(() => {
    const container = mapContainer.current
    if (typeof window === 'undefined' || container === null) return

    const mapbox = new mapboxgl.Map({
      accessToken: MAPBOX_TOKEN,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      container,
      zoom
    })

    const marker = new mapboxgl.Marker({
      draggable: true
    }).setLngLat(MAP_DEFAULT.location).addTo(mapbox)
    marker.on('dragend', () => {
      const lngLat = marker.getLngLat()
      getIso({ center: lngLat }).then(iso => {
        if (iso.geojson) {
          setLayer(mapbox, 'iso', iso.geojson)
        }
      })
    })
        
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      showUserLocation: false
    })
    geolocate.on('geolocate', pos => {
      const position = pos as GeolocationPosition
      const lng = position.coords.longitude
      const lat = position.coords.latitude
      marker.setLngLat([lng, lat])
    })
    mapbox.addControl(geolocate)

    mapbox.addControl(new mapboxgl.NavigationControl())

    mapbox.on('load', () => getIso().then(iso => { 
      if (iso.geojson) addLayer(mapbox, 'iso', iso.geojson)
    }))

    return () => {
      console.log('Removing map...')
      mapbox.remove()
    }
  }, [lng, lat, zoom])

  const addLayer = (
    map: mapboxgl.Map,
    id: string,
    data: FeatureCollection
  ) => {
    map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    }).addLayer(
      {
        id: `${id}Layer`,
        type: 'fill',
        source: id,
        paint: {
          'fill-color': {
            type: 'identity',
            property: 'color'
          },
          'fill-opacity': {
            type: 'identity',
            property: 'opacity'
          }
        },
        layout: {}
      }
    )
    setLayer(map, id, data)
  }
    
  const removeLayer = (map: mapboxgl.Map, id: string) => 
    map.removeLayer(`${id}Layer`).removeSource(id)

  const setLayer = (
    map: mapboxgl.Map,
    id: string,
    data: FeatureCollection
  ) => {
    const src = map.getSource(id) as GeoJSONSource
    src.setData(data)
    fitLayer(map, data)
  }

  const fitLayer = (
    map: mapboxgl.Map,
    data: FeatureCollection
  ) => {
    map.fitBounds(bbox(data) as LngLatBoundsLike, {
      padding: 20
    })
  }

  return <Box w='100%' h='100%' ref={mapContainer} />
}

export default Mapbox