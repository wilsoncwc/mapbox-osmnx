import { FeatureCollection } from 'geojson'

interface LngLat {
    lng: number;
    lat: number;
}

interface Isochrone {
    center: LngLat;
    geojson: FeatureCollection | null;
}

export type {
    LngLat,
    Isochrone
}
