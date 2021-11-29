import { Feature } from 'geojson'
import { MAPBOX_TOKEN } from '../../constants'
import { TravelMode, LngLat } from '../../types'

interface RouteParams {
  mode: TravelMode
  src: LngLat
  dst: LngLat
}

export const getRoute = async (params: RouteParams): Promise<Feature> => {
  const urlBase = 'https://api.mapbox.com/directions/v5/mapbox/'
  const profile = params.mode
  const src = params.src
  const dst = params.dst
      
  const url =
      `${urlBase}${profile}/${src.lng},${src.lat};${dst.lng},${dst.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
    
  const response = await fetch(
    url, 
    { method: 'GET' }
  )
  
  if (!response.ok) {
    // TODO: Error handling
    console.log(response)
  }
  
  const json = await response.json()
  const data = json.routes[0]
  const route = data.geometry.coordinates
  return {
    type: 'Feature',
    properties: {
      label: `${Math.ceil(data.duration / 60)} minutes`
    },
    geometry: {
      type: 'LineString',
      coordinates: route
    }
  }
}

