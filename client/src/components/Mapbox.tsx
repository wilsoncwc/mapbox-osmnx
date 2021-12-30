import React, { useRef, useEffect, useState } from 'react'
import mapboxgl, { GeoJSONSource } from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { distance } from '@turf/turf'
import { Box } from '@chakra-ui/react'
import 'mapbox-gl/dist/mapbox-gl.css'

import Sidebar from './Sidebar'
import { TravelMode, toOxType } from '../types'
import { DEFAULT_MODE, MAPBOX_TOKEN, MAP_DEFAULT, EMPTY_GEOJSON} from '../constants'
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
      marker.setLngLat(lngLat)
      setLoc(lngLat)
    })
    mapbox.addControl(geolocate, 'bottom-right')
    mapbox.addControl(new mapboxgl.NavigationControl(), 'bottom-right')

    // Map Events
    mapbox.on('load', () => {
      // Road vector data layer
      addLayer(mapbox, 'road', 'line', {
        paint: {
          'line-color': '#2D3748',
          'line-width': 1
        },
        layout: {
          'line-join': 'round',
          visibility: 'none'
        }
      })
      setMap(mapbox)
    })

    mapbox.on('click', (event) => {
      marker.setLngLat(event.lngLat)
      setLoc(event.lngLat)
    })

    return () => {
      console.log('Removing map...')
      mapbox.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addLayer = (
    map: mapboxgl.Map,
    id: string,
    type: string,
    layerProps?: any,
    initData = EMPTY_GEOJSON
  ) => {
    map.addSource(id, {
      type: 'geojson',
      data: initData
    }).addLayer(
      {
        id: `${id}Layer`,
        source: id,
        type,
        ...layerProps
      }
    )
  }

  const getRoadIso = (mapbox = map) => {
    if (mapbox) {
      const urlBase = '/api/v1/geoprocessing/isochrone/'
      const bounds = mapbox.getBounds()
      const dist = distance(bounds.getNorthWest().toArray(), bounds.getSouthEast().toArray()) * 1000 / 2 // Get a radius using the diagonal length as an approximate diameter, converted to metres from kilometres
      fetch(`${urlBase}${toOxType(mode)}/${loc.lng},${loc.lat}?dist=${dist}`).then(res =>
        res.json().then(data => {
          const src = mapbox.getSource('road') as GeoJSONSource
          console.log(data)
          console.log(typeof(data))
          src.setData(data)
        })
      ).catch(err => {
        // TODO: Error handling
        console.log(err)
      })
    }
  }

  const toggleLayer = (layer: string, callbackOnVisible?: () => void) => {
    if (map) {
      const visible = map.getLayoutProperty(layer, 'visibility')
      if (visible !== 'visible' && callbackOnVisible) {
        callbackOnVisible()
      }
      map.setLayoutProperty(layer, 'visibility', visible === 'visible' ? 'none' : 'visible')
    }
  }

  return (
    <Box w='100%' h='100%'>
      <Box pos='absolute' p={4} float='left' zIndex={99}>
        <Sidebar
          onModeChange={setMode}
          toggleRoad={() => toggleLayer('roadLayer', getRoadIso)}
        />
      </Box>
      <Box w='100%' h='100%' ref={mapContainer} />
    </Box>
  )
}

export default Mapbox
