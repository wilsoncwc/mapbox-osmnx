export enum TravelMode {
    Walk = 'walking',
    Cycle = 'cycling',
    Drive = 'driving'
}

export const toOxType = (mode: TravelMode): string => {
  switch(mode) {
  case TravelMode.Drive:
    return 'drive'
  case TravelMode.Cycle:
    return 'bike'
  case TravelMode.Walk:
    return 'walk'
  }
}
