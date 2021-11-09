import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css'
import { init } from './utils/constants'

const Mapbox = () => {
    const mapContainer = useRef(null)
    const [map, setMap] = React.useState<mapboxgl.Map>()
    const [lng, setLng] = useState(init.location.lng)
    const [lat, setLat] = useState(init.location.lat)
    const [zoom, setZoom] = useState(init.zoom)

    useEffect(() => {
        const container = mapContainer.current
        if (typeof window === 'undefined' || container === null) return

        const mapbox = new mapboxgl.Map({
            accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            container,
            zoom
        })

        mapbox.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true,
                showUserHeading: true
            })
        )

        setMap(mapbox)
        return () => {
            console.log('Removing map...')
            mapbox.remove()
        }
    }, [lng, lat, zoom])

    return <div ref={mapContainer} className="map-container" />
}

export default Mapbox