import React, { useRef, useEffect, useState } from 'react'
import mapboxgl, { GeoJSONSource, LngLatBounds, LngLatBoundsLike } from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { bbox } from '@turf/turf'
import { Box } from '@chakra-ui/react'
import { FeatureCollection } from 'geojson'
import 'mapbox-gl/dist/mapbox-gl.css'

import Sidebar from './Sidebar'
import { TravelMode } from '../types'
import { getIso } from '../services/isochrone/mapbox'
import { DEFAULT_MODE, MAPBOX_TOKEN, MAP_DEFAULT, EMPTY_GEOJSON, ROAD_FILTER } from '../constants'

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

    // Map Events
    mapbox.on('load', () => {
      // Isochrone Layer
      addLayer(mapbox, 'iso', 'fill', {
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
        layout: {
          visibility: 'visible'
        }
      })
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

    return () => {
      console.log('Removing map...')
      mapbox.remove()
    }
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

  const getAndSetIso = () => {
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

        // Set road network color to that of the containing isochrone
        const sortedIsoPolys = iso.geojson.features.slice().reverse()
        const isochroneIntersectColor = sortedIsoPolys.flatMap(isochrone => 
          [['within', isochrone], isochrone.properties?.color])
        const roadColorCaseRule = ['case', ...isochroneIntersectColor, '#2D3748']
        console.log(roadColorCaseRule)
        map.setPaintProperty('roadLayer', 'line-color', roadColorCaseRule)
        
      }
    })
  }

  const getRoadVect = () => {
    if (map) {
      const roadData = map.querySourceFeatures('composite', { 
        sourceLayer: 'road',
        filter: ['!', ['in', ['get', 'class'], ['literal', ROAD_FILTER]]]
      })
      const src = map.getSource('road') as GeoJSONSource
      const roads: FeatureCollection = {
        type: 'FeatureCollection',
        features: roadData.map(feature => ({
          type: 'Feature',
          geometry: feature.geometry,
          properties: feature.properties
        }))
      }
      src.setData(roads)
      // getVector({
      //   tileset: 'mapbox.mapbox-streets-v8',
      //   bounds,
      //   layer: 'road'
      // }).then(data => {
      //   console.log(data)
      //   const src = map.getSource('road') as GeoJSONSource
      //   // const classifiedData = iso ? matchRoadsToIso(data as FeatureCollection, iso) : data
      //   src.setData(data)
      // })
    }
  }

  useEffect(getAndSetIso, [map, loc, mode])

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
          toggleRoad={() => toggleLayer('roadLayer', getRoadVect)}
          toggleIso={() => toggleLayer('isoLayer')}
        />
      </Box>
      <Box w='100%' h='100%' ref={mapContainer} />
    </Box>
  )
}

export default Mapbox
