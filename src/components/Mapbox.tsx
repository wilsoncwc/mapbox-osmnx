import React, { useRef, useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import mapboxgl, { GeoJSONSource, LngLatBoundsLike } from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { bbox } from '@turf/turf'
import 'mapbox-gl/dist/mapbox-gl.css'
import { DEFAULT_MODE, MAPBOX_TOKEN, MAP_DEFAULT } from '../constants'
import { getIso } from '../services/isochrone/mapbox'
import Sidebar from './Sidebar'
import { TravelMode } from '../types'

const Mapbox = () => {
  const mapContainer = useRef(null)
  const [map, setMap] = useState<mapboxgl.Map>()
  const [loc, setLoc] = useState({
    lng: MAP_DEFAULT.location.lng,
    lat: MAP_DEFAULT.location.lat
  })
  const [mode, setMode] = useState<TravelMode>(DEFAULT_MODE)

  useEffect(() => {
    const container = mapContainer.current
    if (typeof window === 'undefined' || container === null) return

    const mapbox = new mapboxgl.Map({
      accessToken: MAPBOX_TOKEN,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: {
        lng: MAP_DEFAULT.location.lng,
        lat: MAP_DEFAULT.location.lat
      },
      container,
      zoom: MAP_DEFAULT.zoom
    })

    const marker = new mapboxgl.Marker({
      draggable: true
    }).setLngLat(MAP_DEFAULT.location).addTo(mapbox)
    marker.on('dragend', () => {
      console.log('On drag end')
      const lngLat = marker.getLngLat()
      setLoc(lngLat)
    })
        
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      showUserLocation: false
    })
    geolocate.on('geolocate', pos => {
      const lngLat = {
        lng: (pos as GeolocationPosition).coords.longitude,
        lat: (pos as GeolocationPosition).coords.latitude
      }
      console.log('On geolocate')
      marker.setLngLat(lngLat)
      setLoc(lngLat)
    })
    mapbox.addControl(geolocate)
    mapbox.addControl(new mapboxgl.NavigationControl())

    mapbox.on('load', () => {
      addLayer(mapbox, 'iso')
      setMap(mapbox)
    })
    return () => {
      console.log('Removing map...')
      mapbox.remove()
    }
  }, [])

  const addLayer = (
    map: mapboxgl.Map,
    id: string
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
  }

  const recomputeIso = () => {
    getIso({
      center: loc,
      profile: mode
    }).then(iso => {
      if (map && iso.geojson) {
        const src = map.getSource('iso') as GeoJSONSource
        src.setData(iso.geojson)
        map.fitBounds(bbox(iso.geojson) as LngLatBoundsLike, {
          padding: 20
        })
      }
    })
  }
  useEffect(recomputeIso, [map, loc, mode])

  return (
    <Box w='100%' h='100%'>
      <Box pos='absolute' p={4} float='left' zIndex={99}>
        <Sidebar onModeChange={setMode}/>
      </Box>
      <Box w='100%' h='100%' ref={mapContainer} />
    </Box>
  )
}

export default Mapbox
