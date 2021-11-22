import { OPR_TOKEN } from '../../constants'
import { LngLat } from '../../types'

interface MatrixParams {
  loc: LngLat
  nodes: LngLat[]
  profile: string
}

type MatrixLocation = {
  location: number[]
  name: string | undefined
  snapped_distance: number
}

interface MatrixResponse { 
  distances: number[][],
  durations: number[][],
  sources: MatrixLocation[],
  destinations: MatrixLocation[],
  metadata: any
}

export const getMatrix = async (params: MatrixParams): Promise<MatrixResponse> => {
  const urlBase = 'https://api.openrouteservice.org/v2/matrix/'
  const profile = params.profile
  const locations = [
    [params.loc.lng, params.loc.lat],
    ...params.nodes.map(node => [node.lng, node.lat])
  ]
  const response = await fetch(
    `${urlBase}${profile}`,
    {
      method: 'POST',
      headers: {
        'Authorization': OPR_TOKEN ? OPR_TOKEN : '',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        locations,
        destinations: [0]
      })
    }
  )

  if (!response.ok) {
    // TODO: Error handling
    console.log(response)
  }

  const data = await response.json()
  return data
}
