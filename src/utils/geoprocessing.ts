import area from '@turf/area'
import booleanContains from '@turf/boolean-contains'
import { FeatureCollection, Polygon } from 'geojson'

export const matchRoadsToIso = (
  roads: FeatureCollection,
  iso: FeatureCollection
): FeatureCollection => {
  const isochrones = iso.features.sort((a, b) => area(a) - area(b))
  console.log(isochrones)
  const processedRoads = []
  for (let road of roads.features) {
    let converted = false
    if (road.geometry.type === 'MultiLineString') {  
      road.geometry = {
        'type': 'Polygon',
        'coordinates': road.geometry.coordinates
      }
      converted = true
    }
    for (const isochrone of isochrones) {
      if (booleanContains(isochrone, road)) {
        road.properties = {
          ...road.properties,
          color: isochrone.properties?.color,
        }
        if (converted) {
          road.geometry = {
            'type': 'MultiLineString',
            'coordinates': (road.geometry as Polygon).coordinates
          }
        }
        processedRoads.push(road)
        break
      }
    }
  }
  return { 
    features: processedRoads,
    type: 'FeatureCollection'
  }
}
