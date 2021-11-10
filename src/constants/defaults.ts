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

export {
    MAP_DEFAULT,
    DEFAULT_TIME,
    DEFAULT_MODE
}