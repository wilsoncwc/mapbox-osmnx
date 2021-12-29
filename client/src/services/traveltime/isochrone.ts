import { FeatureCollection } from 'geojson'
import { TT_ID, TT_KEY, DEFAULT_TIME } from '../../constants'
import { Isochrone, IsoParams } from '../../types'

export const getTravelTimeIso = async (params: IsoParams): Promise<Isochrone> => {
  const urlBase = 'https://api.traveltimeapp.com/v4/time-map'
  const profile = params.profile
  const lng = params.center.lng
  const lat = params.center.lat
  const minutes: number[] | number = params.minutes || DEFAULT_TIME
  const minutesArr: number[] = Array.isArray(minutes)
    ? minutes : [minutes]
  
  const requestHeaders: HeadersInit = {
    'Accept': 'application/geo+json',
    'Content-Type': 'application/json',
    'X-Application-Id': TT_ID || '',
    'X-Api-Key': TT_KEY || '',
  }
  const requestBody = {
    'departure_searches': minutesArr.map(minute => ({
      'id': `${lng},${lat}-${profile}-${minute}`,
      'coords': { lng, lat },
      'transportation': {
        'type': profile
      },
      'departure_time': new Date().toISOString(),
      'travel_time': minute * 60 // TravelTime requires seconds
    }))
  }

  const response = await fetch(
    urlBase,
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
