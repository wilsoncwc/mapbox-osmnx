# Mapbox-OSMnx Travel Times
An application for testing web map visualizations. It currently computes isochronal map layers with [OSMnx](https://osmnx.readthedocs.io/en/stable/) and visualizes it in [mapbox-gl-js](https://docs.mapbox.com/mapbox-gl-js/api/).

It is built with a [Flask](https://flask.palletsprojects.com/en/2.0.x/) backend and [Next.js](https://nextjs.org/) frontend, connected using the typical nginx reverse-proxy.

## Prerequistes
You will need the following to run the complete application
 * [Docker Desktop](https://www.docker.com/products/docker-desktop) installed with `docker-compose`
 * A [Mapbox API Key](https://docs.mapbox.com/help/getting-started/access-tokens/)

## Running locally
In the `client` folder, enter the following into a new file called `.env.local`, replacing <access_token> with your key
```
NEXT_PUBLIC_MAPBOX_TOKEN=<access_token>
```

Then run the following in the project root folder.
```bash
docker-compose build
docker-compose up -d
```
After a successful build, the server will be available at localhost:8080.

## Deployment
This repository is setup to deploy via Github Actions to a [DigitalOcean Droplet](https://www.digitalocean.com/products/droplets/).
