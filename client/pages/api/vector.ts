var vt2geojson = require('@mapbox/vt2geojson')
import { GeoJsonObject } from 'geojson'
import type { NextApiRequest, NextApiResponse } from 'next'
const escapeChars = (str: string | string[]) => {
  return Array.isArray(str)
    ? str.map(decodeURIComponent)
    : decodeURIComponent(str)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GeoJsonObject>
) {
  let {
    query: { uri, layer }
  } = req

  await new Promise((resolve, reject) => {
    vt2geojson({
      uri: escapeChars(uri), // uri should never be an array
      layer: escapeChars(layer)
    }, (err: any, result: any) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  }).then((result) => {
    res.status(200).json(result as GeoJsonObject)
  }).catch(err => res.status(400).send(err))
}
