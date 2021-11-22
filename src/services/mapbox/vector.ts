import { LngLatBounds } from 'mapbox-gl'
import { MAPBOX_TOKEN } from '../../constants'
var tilebelt = require('@mapbox/tilebelt')

export interface VecParams {
  tileset: string;
  bounds: LngLatBounds;
  layer?: string;
  style?: string;
}

export const getVector = async (params: VecParams) => {
  const urlBase = 'https://api.mapbox.com/v4/'
  const tileset = params.tileset
  const bbox = params.bounds.toArray().flat()
  const [x, y, zoom] = tilebelt.bboxToTile(bbox)
  const format = '.mvt'
  const optional_style = params.style ? `style=${params.style}`: ''
  const layer = params.layer
    
  const uri =
    `${urlBase}${tileset}/${zoom}/${x}/${y}${format}?${optional_style}&access_token=${MAPBOX_TOKEN}`
  
  const response = await fetch('/api/vector?' + new URLSearchParams({
    uri,
    ...(layer && { layer })
  }))

  if (!response.ok) {
    // TODO: Error handling
    console.log(response)
  }

  const data = await response.json()
  return data
}
