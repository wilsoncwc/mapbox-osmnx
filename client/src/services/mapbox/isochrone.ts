import { Isochrone, IsoParams } from '../../types'
import { DEFAULT_MODE, DEFAULT_TIME, MAPBOX_TOKEN, MAP_DEFAULT } from '../../constants'
import { FeatureCollection } from 'geojson'

const DEFAULT_PARAMS: IsoParams = {
  center: MAP_DEFAULT.location,
  profile: DEFAULT_MODE
}

export const getMapboxIso = async (params = DEFAULT_PARAMS): Promise<Isochrone> => {
  const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/'
  const profile = params.profile
  const lon = params.center.lng
  const lat = params.center.lat
  const minutes = params.minutes || DEFAULT_TIME
  const minutesStr = Array.isArray(minutes)
    ? minutes.join(',') : minutes.toString()

  const response = await fetch(
    `${urlBase}${profile}/${lon},${lat}?contours_minutes=${minutesStr}&polygons=true&access_token=${MAPBOX_TOKEN}`,
    { method: 'GET' }
  )

  if (!response.ok) {
    // TODO: Error handling
    console.log(response)
  }

  const data: FeatureCollection = await response.json()
  data.features.reverse()
  return {
    center: params.center,
    geojson: data
  }
}
