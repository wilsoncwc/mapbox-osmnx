import React, { useRef, useEffect, useState } from 'react'
import mapboxgl, { GeoJSONSource } from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css'
import { MAPBOX_TOKEN, MAP_DEFAULT } from '../constants'
import { FeatureCollection } from 'geojson'
import { getIso } from '../services/isochrone/mapbox'

const Mapbox = () => {
    const mapContainer = useRef(null)
    const [lng, setLng] = useState(MAP_DEFAULT.location.lng)
    const [lat, setLat] = useState(MAP_DEFAULT.location.lat)
    const [zoom, setZoom] = useState(MAP_DEFAULT.zoom)

    useEffect(() => {
        const container = mapContainer.current
        if (typeof window === 'undefined' || container === null) return

        const mapbox = new mapboxgl.Map({
            accessToken: MAPBOX_TOKEN,
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
        mapbox.addControl(new mapboxgl.NavigationControl())
        new mapboxgl.Marker().setLngLat(MAP_DEFAULT.location).addTo(mapbox)

        mapbox.on('load', () => getIso().then(iso => { 
            if (iso.geojson) addLayer(mapbox, 'iso', iso.geojson)
        }))

        return () => {
            console.log('Removing map...')
            mapbox.remove()
        }
    }, [lng, lat, zoom])

    const addLayer = (
        map: mapboxgl.Map,
        id: string,
        data: FeatureCollection
    ) => (
        map.addSource(id, {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: []
            }
        }).addLayer(
            {
                id: `${id}Layer`,
                type: 'fill',
                source: id,
                paint: {
                    'fill-color': {
                        type: 'identity',
                        property: 'color'
                    },
                    'fill-opacity': {
                        type: 'identity',
                        property: 'opacity'
                    }
                },
                layout: {}
            },
        ).getSource(id) as GeoJSONSource
    ).setData(data)

    const removeLayer = (map: mapboxgl.Map, id: string) => 
        map.removeLayer(`${id}Layer`).removeSource(id)

    return <div ref={mapContainer} className="map-container" />
}

export default Mapbox