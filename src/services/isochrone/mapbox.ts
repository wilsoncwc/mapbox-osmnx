import { Isochrone, LngLat } from '../../types/geom'
import { DEFAULT_MODE, DEFAULT_TIME, MAPBOX_TOKEN, MAP_DEFAULT } from '../../constants'
import { FeatureCollection } from 'geojson'

export interface IsoParams {
    center: LngLat;
    profile: string;
    minutes: number | number[];
}

const DEFAULT_PARAMS: IsoParams = {
    center: MAP_DEFAULT.location,
    profile: DEFAULT_MODE,
    minutes: DEFAULT_TIME
}

export const getIso = async (params = DEFAULT_PARAMS): Promise<Isochrone> => {
    const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/'
    const profile = params.profile
    const lon = params.center.lng
    const lat = params.center.lat
    const minutes = Array.isArray(params.minutes)
        ? params.minutes.join(',') : params.minutes.toString()

    const response = await fetch(
        `${urlBase}${profile}/${lon},${lat}?contours_minutes=${minutes}&polygons=true&access_token=${MAPBOX_TOKEN}`,
        { method: 'GET' }
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