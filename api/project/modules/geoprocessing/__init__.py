from flask import jsonify, request
from flask_restx import Namespace, Resource, abort
import osmnx as ox
import geopandas as gpd
import json
from .utils import gdf_to_nx, add_traveltime_colors

ns = Namespace('Geoprocessing',
                description='Geoprocessing related operations')

@ns.route('/isochrone/<mode>/<float(signed=True):srcLng>,<float(signed=True):srcLat>')
@ns.param('mode', 'One of "bike", "drive", or "walk"')
@ns.param('srcLng', 'Longitude of the coordinate to center the isochrone')
@ns.param('srcLat', 'Latitude of the coordinate to center the isochrone')
class Isochrone(Resource):
    def get(self, mode, srcLng, srcLat):
        center_point = (srcLat, srcLng) # osmnx expects (lng,lat)
        bbox = request.args.get('bbox')
        distance = request.args.get('dist')
        if bbox:
            coords = bbox.split(',')
            coords = list(map(float, coords))
            if len(coords) != 4:
                abort(400, 'bbox should contain 4 floats in the order: north latitude, south latitude, east longitude, west longitude.')
        G = None
        # download the street network and project the graph to UTM
        
        try:
            if bbox:
                coords = bbox.split(',')
                coords = list(map(float, coords))
                if len(coords) != 4:
                    abort(400, 'bbox should contain 4 floats in the order: north latitude, south latitude, east longitude, west longitude.')
                G = ox.graph_from_bbox(*coords, network_type=mode)
            else:
                G = ox.graph_from_point(center_point, network_type=mode, dist=float(distance))
            G = ox.project_graph(G)
        except:
            abort(400, 'Error retrieving network graph using given parameters.')
        center_node = ox.nearest_nodes(G, center_point[0], center_point[1])
        (G, error) = add_traveltime_colors(G, center_node, mode)
        if not G:
            abort(400, error)

        # extract graph edges as GeoJSON and return
        gdf_edges = ox.graph_to_gdfs(G, nodes=False)
        gdf_edges = ox.io._stringify_nonnumeric_cols(gdf_edges)
        geojson_str = gdf_edges.to_json()
        return jsonify(json.loads(geojson_str))

    # def post(self, mode, srcLng, srcLat):
    #     center_point = (srcLat, srcLng) # osmnx expects (lng,lat)
    #     geojson = ns.payload # expecting GeoPolygon 
    #     print(geojson)
    #     features = ns.payload.geojson['features']
    #     try:
    #         gdf = gpd.GeoDataFrame.from_features(features)
    #         G = gdf_to_nx(gdf)
    #     except:
    #         abort('Unable to convert payload to graph')

    #     (G, error) = add_traveltime_colors(G, center_point, mode)
    #     if not G:
    #         abort(400, error)

    #     gdf_edges = ox.graph_to_gdfs(G, nodes=False)
    #     gdf_edges = ox.io._stringify_nonnumeric_cols(gdf_edges)
    #     geojson_str = gdf_edges.to_json()
    #     return jsonify(json.loads(geojson_str))