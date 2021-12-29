import { TravelMode } from '../types'

const MAP_DEFAULT = {
  location: {
    lng: -0.176894,
    lat: 51.498356
  },
  zoom: 14
}

const DEFAULT_TIME = [15,30,45,60]
const DEFAULT_MODE = TravelMode.Walk
const DEFAULT_API = 'Mapbox'
const DEFAULT_ISO_OPACITY = 0.33

export {
  MAP_DEFAULT,
  DEFAULT_TIME,
  DEFAULT_MODE,
  DEFAULT_API,
  DEFAULT_ISO_OPACITY
}
