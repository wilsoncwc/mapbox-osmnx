import { Isochrone, IsoParams, TravelMode } from '../types'
import { getMapboxIso } from './mapbox'
import { getTravelTimeIso } from './traveltime'
import { getOPRIso } from './openrouteservice'

export interface IsoDetails {
  modes: TravelMode[];
  handler: (params: IsoParams) => Promise<Isochrone>
}
export const ISO_APIS: { [name: string]: IsoDetails } = {
  'Mapbox': {
    modes: [TravelMode.Walk, TravelMode.Cycle, TravelMode.Drive],
    handler: getMapboxIso
  },
  'TravelTime': {
    modes: [TravelMode.Walk, TravelMode.Cycle, TravelMode.Drive, TravelMode.Transport],
    handler: getTravelTimeIso
  },
  'OpenRouteService': {
    modes: [TravelMode.Walk, TravelMode.Cycle, TravelMode.Drive],
    handler: getOPRIso
  }
}

export const getIso = (payload: IsoParams, api: string) => {
  if (ISO_APIS[api].modes.includes(payload.profile)) {
    return ISO_APIS[api].handler(payload)
  }
  return Promise.reject('Unsupported travel mode for this service')
}

