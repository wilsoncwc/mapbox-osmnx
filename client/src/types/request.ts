import { LngLat, TravelMode } from './index'

export interface IsoParams {
    center: LngLat;
    profile: TravelMode;
    minutes?: number | number[];
}
