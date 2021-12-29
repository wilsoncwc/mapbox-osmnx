import { FeatureCollection } from 'geojson'
import { OPR_TOKEN, DEFAULT_TIME } from '../../constants'
import { Isochrone, IsoParams, TravelMode } from '../../types'

const toOPRMode = (mode: TravelMode) => {
  switch (mode) {
  case TravelMode.Walk:
    return 'foot-walking'
  case TravelMode.Cycle:
    return 'cycling-road'
  case TravelMode.Drive:
    return 'driving-car'
  default:
    return 'driving-car'
  }
}

export const getOPRIso = async (params: IsoParams): Promise<Isochrone> => {
  const urlBase = 'https://api.openrouteservice.org/v2/isochrones/'
  const mode = toOPRMode(params.profile)
  const lon = params.center.lng
  const lat = params.center.lat
  const minutes: number[] | number = params.minutes || DEFAULT_TIME
  const minutesArr: number[] = Array.isArray(minutes)
    ? minutes : [minutes]
  
  const requestHeaders: HeadersInit = {
    'Accept': 'application/geo+json',
    'Authorization': OPR_TOKEN || '',
    'Content-Type': 'application/json',
  }
  const requestBody = {
    'locations': [[lon, lat]],
    'range': minutesArr.map(minute => minute * 60)
  }

  const response = await fetch(
    `${urlBase}${mode}`,
    { 
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestBody)
    }
  )
  
  if (!response.ok) {
    // TODO: Error handling
    console.log(response)
  }
  
  const data = await response.json()
  return {
    center: params.center,
    geojson: data as FeatureCollection
  }
}
